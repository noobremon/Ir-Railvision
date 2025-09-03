from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import cv2
import numpy as np
import asyncio
import json
import base64
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
import threading
import time
from collections import defaultdict
import bcrypt
import jwt
from jwt import PyJWTError
from enum import Enum
import random
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/railway_surveillance')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'railway_surveillance')]

# Create directories for video storage
RECORDINGS_DIR = ROOT_DIR / "recordings"
RECORDINGS_DIR.mkdir(exist_ok=True)

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI(title="Railway Video Surveillance System", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# User Roles
class UserRole(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    SECURITY_OFFICER = "security_officer"

# Event Types
class EventType(str, Enum):
    MOTION = "motion"
    DROWSINESS = "drowsiness"
    PANIC = "panic"
    INTRUSION = "intrusion"
    CROWD_GATHERING = "crowd_gathering"
    ABANDONED_OBJECT = "abandoned_object"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    role: UserRole
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: UserRole

class UserLogin(BaseModel):
    username: str
    password: str

class Camera(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    source: str = "0"  # 0 for default webcam, or IP camera URL
    is_active: bool = False
    is_recording: bool = False
    gps_lat: float = 0.0
    gps_lng: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_seen: Optional[datetime] = None
    fps: int = 30
    resolution: str = "640x480"

class CameraCreate(BaseModel):
    name: str
    location: str
    source: str = "0"  # Default to webcam
    gps_lat: float = 0.0
    gps_lng: float = 0.0

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    camera_id: str
    camera_name: str = ""
    event_type: EventType
    description: str
    confidence: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    gps_lat: float = 0.0
    gps_lng: float = 0.0
    video_path: Optional[str] = None
    image_path: Optional[str] = None
    is_acknowledged: bool = False
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    severity: str = "medium"  # low, medium, high, critical

class Recording(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    camera_id: str
    camera_name: str = ""
    start_time: datetime
    end_time: Optional[datetime] = None
    file_path: str
    file_size: int = 0
    duration: int = 0  # in seconds
    event_triggered: bool = False
    event_id: Optional[str] = None

# Global variables for video processing
active_cameras = {}
websocket_connections = []
video_processors = {}

# Mock video frames for demonstration
def generate_mock_frame():
    """Generate a mock surveillance camera frame"""
    # Create a base image
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    
    # Background gradient
    for i in range(480):
        intensity = int(30 + (i / 480) * 50)
        img[i, :] = [intensity, intensity, intensity + 10]
    
    # Add some "surveillance" elements
    current_time = datetime.now()
    
    # Add timestamp
    cv2.putText(img, current_time.strftime("%Y-%m-%d %H:%M:%S"), 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    # Add camera info
    cv2.putText(img, "RAILWAY VSS - LIVE", 
                (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    
    # Add some moving elements to simulate activity
    second = current_time.second
    x_pos = int((second / 60) * 600) + 20
    cv2.circle(img, (x_pos, 200), 20, (0, 0, 255), -1)
    cv2.putText(img, "MOTION", (x_pos - 30, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    # Add grid lines for professional look
    for i in range(0, 640, 80):
        cv2.line(img, (i, 0), (i, 480), (40, 40, 40), 1)
    for i in range(0, 480, 60):
        cv2.line(img, (0, i), (640, i), (40, 40, 40), 1)
    
    # Add status indicators
    cv2.rectangle(img, (500, 400), (620, 460), (0, 100, 0), -1)
    cv2.putText(img, "RECORDING", (510, 425), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    cv2.putText(img, "AI ACTIVE", (510, 445), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    
    return img

# Enhanced Video Processing Class
class VideoProcessor:
    def __init__(self, camera_id, source, camera_name="Unknown"):
        self.camera_id = camera_id
        self.source = source
        self.camera_name = camera_name
        self.cap = None
        self.is_running = False
        self.use_mock = False
        self.motion_detector = cv2.createBackgroundSubtractorMOG2(detectShadows=True)
        self.last_frame = None
        self.recording = False
        self.video_writer = None
        self.current_recording = None
        self.frame_count = 0
        self.last_motion_time = 0
        self.fps = 10  # Reduced FPS for better performance
        
    def start(self):
        try:
            # Try to initialize real camera first
            source = int(self.source) if self.source.isdigit() else self.source
            self.cap = cv2.VideoCapture(source)
            
            if not self.cap or not self.cap.isOpened():
                logging.warning(f"Real camera {self.source} not available, using mock feed")
                self.use_mock = True
                self.cap = None
            else:
                self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                self.cap.set(cv2.CAP_PROP_FPS, self.fps)
                logging.info(f"Real camera {self.source} initialized successfully")
            
            self.is_running = True
            return True
            
        except Exception as e:
            logging.warning(f"Camera initialization failed: {e}, falling back to mock feed")
            self.use_mock = True
            self.cap = None
            self.is_running = True
            return True
    
    def stop(self):
        self.is_running = False
        if self.cap:
            self.cap.release()
        if self.video_writer:
            self.video_writer.release()
    
    def get_frame(self):
        if not self.is_running:
            return None
            
        frame = None
        
        if self.use_mock:
            # Generate mock frame
            frame = generate_mock_frame()
        else:
            # Try to get real frame
            if self.cap:
                ret, frame = self.cap.read()
                if not ret:
                    logging.warning("Failed to read from camera, switching to mock")
                    self.use_mock = True
                    frame = generate_mock_frame()
        
        if frame is None:
            frame = generate_mock_frame()
            
        # Process frame for events
        self.process_frame_for_events(frame)
        
        # Encode frame for streaming
        try:
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
            frame_bytes = base64.b64encode(buffer).decode('utf-8')
            
            self.frame_count += 1
            
            return {
                'camera_id': self.camera_id,
                'camera_name': self.camera_name,
                'frame': frame_bytes,
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'frame_count': self.frame_count,
                'fps': self.fps,
                'mock': self.use_mock
            }
        except Exception as e:
            logging.error(f"Frame encoding failed: {e}")
            return None
    
    def process_frame_for_events(self, frame):
        """Enhanced frame processing for multiple event types"""
        try:
            current_time = time.time()
            
            # Ensure frame is valid
            if frame is None or frame.size == 0:
                logging.warning("Invalid frame received for processing")
                return
            
            # Motion Detection
            if self.last_frame is not None:
                fg_mask = self.motion_detector.apply(frame)
                motion_area = cv2.countNonZero(fg_mask)
                
                # Motion event with adaptive threshold
                if motion_area > 2000:  # Increased threshold
                    if current_time - self.last_motion_time > 5:  # Avoid spam events
                        self.last_motion_time = current_time
                        asyncio.create_task(self.trigger_event(
                            EventType.MOTION, 
                            f"Significant motion detected (area: {motion_area} pixels)",
                            min(0.95, motion_area / 10000),  # Dynamic confidence
                            "medium"
                        ))
            
            # Simulate other AI events periodically for demonstration
            if self.frame_count % 1200 == 0:  # Every ~2 minutes at 10fps
                event_type = random.choice([EventType.CROWD_GATHERING, EventType.DROWSINESS, EventType.PANIC])
                descriptions = {
                    EventType.CROWD_GATHERING: "Crowd gathering detected on platform",
                    EventType.DROWSINESS: "Driver drowsiness pattern detected",
                    EventType.PANIC: "Unusual crowd behavior pattern detected"
                }
                
                asyncio.create_task(self.trigger_event(
                    event_type,
                    descriptions[event_type],
                    random.uniform(0.7, 0.95),
                    random.choice(["medium", "high"])
                ))
            
            # Store frame for processing
            self.last_frame = frame.copy()
            
        except Exception as e:
            logging.error(f"Error processing frame for events: {e}")
    
    async def trigger_event(self, event_type: EventType, description: str, confidence: float, severity: str = "medium"):
        """Enhanced event triggering with better data"""
        try:
            # Get camera info for GPS
            camera = await db.cameras.find_one({"id": self.camera_id})
            
            event = Event(
                camera_id=self.camera_id,
                camera_name=camera.get('name', 'Unknown Camera') if camera else 'Unknown Camera',
                event_type=event_type,
                description=description,
                confidence=confidence,
                gps_lat=camera.get('gps_lat', 0.0) if camera else 0.0,
                gps_lng=camera.get('gps_lng', 0.0) if camera else 0.0,
                severity=severity
            )
            
            # Save to database
            await db.events.insert_one(event.dict())
            
            # Notify connected websockets
            notification = {
                'type': 'event',
                'data': event.dict()
            }
            
            # Send to all connected clients
            disconnected_clients = []
            for websocket in websocket_connections:
                try:
                    await websocket.send_text(json.dumps(notification, default=str))
                except:
                    disconnected_clients.append(websocket)
            
            # Clean up disconnected clients
            for client in disconnected_clients:
                websocket_connections.remove(client)
                    
        except Exception as e:
            logging.error(f"Error triggering event: {e}")

# Authentication functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except PyJWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"username": payload.get("sub")})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

# Enhanced API Routes
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        role=user_data.role
    )
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token({"sub": user.username, "role": user.role})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    user = await db.users.find_one({"username": login_data.username})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user["username"], "role": user["role"]})
    
    return {"access_token": access_token, "token_type": "bearer", "user": User(**user)}

@api_router.post("/auth/logout")
async def logout(current_user: User = Depends(get_current_user)):
    # In a real implementation, you might want to blacklist the token
    return {"message": "Successfully logged out"}

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/cameras", response_model=Camera)
async def create_camera(camera_data: CameraCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    camera = Camera(**camera_data.dict())
    await db.cameras.insert_one(camera.dict())
    return camera

@api_router.get("/cameras", response_model=List[Camera])
async def get_cameras(current_user: User = Depends(get_current_user)):
    cameras = await db.cameras.find().to_list(1000)
    return [Camera(**camera) for camera in cameras]

@api_router.get("/cameras/{camera_id}", response_model=Camera)
async def get_camera(camera_id: str, current_user: User = Depends(get_current_user)):
    camera = await db.cameras.find_one({"id": camera_id})
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return Camera(**camera)

@api_router.put("/cameras/{camera_id}", response_model=Camera)
async def update_camera(camera_id: str, camera_data: CameraCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    result = await db.cameras.update_one(
        {"id": camera_id},
        {"$set": camera_data.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    updated_camera = await db.cameras.find_one({"id": camera_id})
    return Camera(**updated_camera)

@api_router.delete("/cameras/{camera_id}")
async def delete_camera(camera_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Stop camera if running
    if camera_id in video_processors:
        processor = video_processors[camera_id]
        processor.stop()
        del video_processors[camera_id]
    
    result = await db.cameras.delete_one({"id": camera_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    return {"message": "Camera deleted successfully"}

@api_router.post("/cameras/{camera_id}/start")
async def start_camera(camera_id: str, current_user: User = Depends(get_current_user)):
    try:
        camera = await db.cameras.find_one({"id": camera_id})
        if not camera:
            raise HTTPException(status_code=404, detail="Camera not found")
        
        if camera_id in video_processors:
            return {"message": "Camera already running", "status": "active"}
        
        processor = VideoProcessor(camera_id, camera["source"], camera["name"])
        
        if processor.start():
            video_processors[camera_id] = processor
            await db.cameras.update_one(
                {"id": camera_id}, 
                {
                    "$set": {
                        "is_active": True,
                        "last_seen": datetime.now(timezone.utc)
                    }
                }
            )
            
            return {
                "message": "Camera started successfully",
                "status": "active",
                "mock_mode": processor.use_mock,
                "camera_name": camera["name"]
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to initialize camera")
            
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error starting camera {camera_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@api_router.post("/cameras/{camera_id}/stop")
async def stop_camera(camera_id: str, current_user: User = Depends(get_current_user)):
    if camera_id not in video_processors:
        raise HTTPException(status_code=400, detail="Camera not running")
    
    processor = video_processors[camera_id]
    processor.stop()
    del video_processors[camera_id]
    
    await db.cameras.update_one({"id": camera_id}, {"$set": {"is_active": False}})
    return {"message": "Camera stopped successfully", "status": "inactive"}

@api_router.get("/events", response_model=List[Event])
async def get_events(
    limit: int = 100,
    event_type: Optional[EventType] = None,
    camera_id: Optional[str] = None,
    acknowledged: Optional[bool] = None,
    severity: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if event_type:
        query["event_type"] = event_type
    if camera_id:
        query["camera_id"] = camera_id
    if acknowledged is not None:
        query["is_acknowledged"] = acknowledged
    if severity:
        query["severity"] = severity
    
    events = await db.events.find(query).sort("timestamp", -1).limit(limit).to_list(limit)
    return [Event(**event) for event in events]

@api_router.put("/events/{event_id}/acknowledge")
async def acknowledge_event(event_id: str, current_user: User = Depends(get_current_user)):
    result = await db.events.update_one(
        {"id": event_id},
        {
            "$set": {
                "is_acknowledged": True,
                "acknowledged_by": current_user.username,
                "acknowledged_at": datetime.now(timezone.utc)
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event acknowledged successfully"}

@api_router.get("/recordings", response_model=List[Recording])
async def get_recordings(
    limit: int = 100,
    camera_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    query = {}
    if camera_id:
        query["camera_id"] = camera_id
    
    recordings = await db.recordings.find(query).sort("start_time", -1).limit(limit).to_list(limit)
    return [Recording(**recording) for recording in recordings]

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    total_cameras = await db.cameras.count_documents({})
    active_cameras = len(video_processors)
    
    # Today's events
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_events = await db.events.count_documents({
        "timestamp": {"$gte": today_start}
    })
    
    unacknowledged_events = await db.events.count_documents({"is_acknowledged": False})
    
    # Recent events by type
    recent_events = await db.events.find().sort("timestamp", -1).limit(10).to_list(10)
    events_by_type = {}
    for event in recent_events:
        event_type = event["event_type"]
        events_by_type[event_type] = events_by_type.get(event_type, 0) + 1
    
    # System health
    system_health = {
        "database": "online",
        "websocket": "active" if len(websocket_connections) > 0 else "inactive",
        "video_processing": "active" if len(video_processors) > 0 else "inactive",
        "storage": "available"
    }
    
    return {
        "total_cameras": total_cameras,
        "active_cameras": active_cameras,
        "today_events": today_events,
        "unacknowledged_events": unacknowledged_events,
        "events_by_type": events_by_type,
        "system_health": system_health,
        "connected_clients": len(websocket_connections)
    }

# Enhanced WebSocket with better error handling
@api_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)
    
    try:
        # Send initial connection confirmation
        await websocket.send_text(json.dumps({
            'type': 'connection',
            'status': 'connected',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'server': 'Railway Video Surveillance System'
        }))
        
        while True:
            try:
                # Send video frames from all active cameras
                frames = []
                for camera_id, processor in list(video_processors.items()):
                    try:
                        frame_data = processor.get_frame()
                        if frame_data:
                            frames.append(frame_data)
                    except Exception as e:
                        logging.error(f"Error getting frame from camera {camera_id}: {e}")
                
                if frames:
                    await websocket.send_text(json.dumps({
                        'type': 'video_frames',
                        'data': frames,
                        'timestamp': datetime.now(timezone.utc).isoformat()
                    }, default=str))
                
                # Send heartbeat every 30 seconds
                if len(frames) == 0:
                    await websocket.send_text(json.dumps({
                        'type': 'heartbeat',
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'active_cameras': len(video_processors),
                        'status': 'healthy'
                    }))
                
                await asyncio.sleep(0.1)  # ~10 FPS
                
            except WebSocketDisconnect:
                break
            except Exception as e:
                logging.error(f"WebSocket frame error: {e}")
                await asyncio.sleep(1)  # Prevent tight error loop
                
    except WebSocketDisconnect:
        logging.info("WebSocket client disconnected")
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
    finally:
        if websocket in websocket_connections:
            websocket_connections.remove(websocket)
            logging.info(f"Removed WebSocket connection. Active connections: {len(websocket_connections)}")

# Include router
app.include_router(api_router)

# Serve static files for recordings
app.mount("/recordings", StaticFiles(directory=RECORDINGS_DIR), name="recordings")

# CORS
allowed_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5000').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.basicConfig(
    level=getattr(logging, log_level.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Railway Video Surveillance System starting up...")
    
    # Create default admin user if none exists
    admin_exists = await db.users.find_one({"role": "admin"})
    if not admin_exists:
        admin_user = User(
            username="admin",
            email="admin@railway.gov.in",
            role=UserRole.ADMIN
        )
        admin_dict = admin_user.dict()
        admin_dict["password"] = hash_password("admin123")  # Change in production
        await db.users.insert_one(admin_dict)
        logger.info("Default admin user created: admin/admin123")
    
    # Create sample users for different roles
    operator_exists = await db.users.find_one({"username": "operator"})
    if not operator_exists:
        operator_user = User(
            username="operator",
            email="operator@railway.gov.in", 
            role=UserRole.OPERATOR
        )
        operator_dict = operator_user.dict()
        operator_dict["password"] = hash_password("operator123")
        await db.users.insert_one(operator_dict)
        logger.info("Default operator user created: operator/operator123")
    
    security_exists = await db.users.find_one({"username": "security"})
    if not security_exists:
        security_user = User(
            username="security",
            email="security@railway.gov.in",
            role=UserRole.SECURITY_OFFICER
        )
        security_dict = security_user.dict()
        security_dict["password"] = hash_password("security123")
        await db.users.insert_one(security_dict)
        logger.info("Default security user created: security/security123")

@app.on_event("shutdown")
async def shutdown_event():
    # Stop all cameras
    for processor in video_processors.values():
        processor.stop()
    
    # Close all websocket connections
    for websocket in websocket_connections.copy():
        try:
            await websocket.close()
        except:
            pass
    
    client.close()
    logger.info("Railway Video Surveillance System shutting down...")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "active_cameras": len(video_processors),
        "connected_clients": len(websocket_connections),
        "system": "Railway Video Surveillance System v1.0"
    }