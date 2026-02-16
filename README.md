# 🚂 IR RailVision - Railway Video Surveillance System

A comprehensive, real-time video surveillance system designed for railway security operations. Monitor multiple cameras, detect security events, manage recordings, and track incidents with role-based access control.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![React](https://img.shields.io/badge/react-18.3-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)

---

## ✨ Key Features

- 📹 **Multi-Camera Management** - Add, configure, and monitor multiple cameras (webcam/IP cameras)
- 🎥 **Real-Time Video Streaming** - Low-latency WebSocket-based video feeds
- 🔔 **Smart Event Detection** - Automated alerts for motion, intrusion, crowd gathering, drowsiness, panic, and abandoned objects
- 👥 **Role-Based Access Control** - Three user roles: Admin, Operator, and Security Officer
- 🔐 **Secure Authentication** - JWT-based authentication with session management
- 💾 **Recording & Playback** - Automatic event recording with download capability
- 📍 **GPS Location Tracking** - Geographic tagging for camera locations
- 📊 **Real-Time Dashboard** - Live statistics and system health monitoring
- 🎭 **Mock Mode** - Run without MongoDB or physical cameras for testing/demo
- 🔄 **Multi-User Support** - Concurrent user sessions with real-time updates

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104 (Python 3.8+)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (PyJWT)
- **Video Processing**: OpenCV
- **Real-Time**: WebSocket
- **Server**: Uvicorn (ASGI)

### Frontend
- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **UI Components**: Radix UI
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6.28
- **Icons**: Lucide React

### Database
- **Primary**: MongoDB (with async Motor driver)
- **Fallback**: In-memory mock database (for demo mode)

---

## 📁 Project Structure

```
IR Railways/
│
├── backend/                    # Backend API server
│   ├── server.py              # Main FastAPI application
│   ├── run.py                 # Server startup script
│   ├── requirements.txt       # Python dependencies
│   └── recordings/            # Stored video recordings
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Radix UI components (buttons, cards, etc.)
│   │   │   └── TestConnection.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API client
│   │   └── index.jsx        # Application entry point
│   │
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── tailwind.config.js   # TailwindCSS configuration
│
├── recordings/              # Root recordings directory
├── test/                    # Test files
├── server.py               # Standalone server (alternative entry)
├── backend_test.py         # Backend API tests
├── test_multi_user.py      # Multi-user scenario tests
└── README.md               # Project documentation

```

---

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB (optional - system works in mock mode without it)
- Webcam or IP camera (optional - mock video generation available)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/noobremon/Ir-Railvision.git
   cd "IR Railways"
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/railway_surveillance
DB_NAME=railway_surveillance

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000

# Logging
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_URL=http://localhost:8000
```

> **Note**: The frontend uses Vite proxy by default, so this is optional for local development.

---

## 🏃 Running Locally

### Start Backend Server

```bash
# From project root
uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`

- API Documentation (Swagger): `http://localhost:8000/docs`
- Alternative API Docs (ReDoc): `http://localhost:8000/redoc`

> **Mock Mode**: If MongoDB is not available, the system automatically runs in mock mode with in-memory database simulation.

### Start Frontend Development Server

```bash
# From frontend directory
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

---

## 📦 Build & Deployment

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/dist/`.

### Serve Frontend Build

```bash
npm run preview
```

### Deploy Backend

1. **Set production environment variables**
   ```bash
   export JWT_SECRET=<strong-random-secret>
   export MONGO_URL=<production-mongodb-url>
   export CORS_ORIGINS=https://yourdomain.com
   ```

2. **Run with production server**
   ```bash
   uvicorn backend.server:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. **Using Gunicorn** (recommended)
   ```bash
   pip install gunicorn
   gunicorn backend.server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for backend
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user info |

### Camera Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cameras` | Create new camera |
| GET | `/api/cameras` | List all cameras |
| GET | `/api/cameras/{id}` | Get camera details |
| PUT | `/api/cameras/{id}` | Update camera |
| DELETE | `/api/cameras/{id}` | Delete camera |
| POST | `/api/cameras/{id}/start` | Start camera streaming |
| POST | `/api/cameras/{id}/stop` | Stop camera streaming |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events (with filters) |
| PUT | `/api/events/{id}/acknowledge` | Acknowledge event |

### Recordings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recordings` | List all recordings |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get system statistics |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| WS | `/api/ws/video/{camera_id}` | Real-time video stream |

---

## 💡 Usage Examples

### Register a New User (cURL)

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "operator1",
    "email": "operator@railway.com",
    "password": "securepass123",
    "role": "operator"
  }'
```

### Add a New Camera (Python)

```python
import requests

headers = {"Authorization": "Bearer YOUR_JWT_TOKEN"}
data = {
    "name": "Platform 1 - North",
    "location": "Platform 1",
    "source": "0",  # Webcam ID or RTSP URL
    "gps_lat": 28.6139,
    "gps_lng": 77.2090
}

response = requests.post(
    "http://localhost:8000/api/cameras", 
    json=data, 
    headers=headers
)
print(response.json())
```

### WebSocket Video Stream (JavaScript)

```javascript
const ws = new WebSocket('ws://localhost:8000/api/ws/video/camera-id');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.frame) {
    // Display base64 image
    imageElement.src = `data:image/jpeg;base64,${data.frame}`;
  }
};
```

---

## 🖼️ Screenshots

> **Coming Soon**: Screenshots will be added here showing:
> - Login page
> - Main dashboard with camera grid
> - Camera management interface
> - Event timeline and alerts
> - Recording playback
> - User management panel

---

## 🏗️ Architecture & Flow

### System Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │◄───────►│   FastAPI    │◄───────►│   MongoDB   │
│  (React)    │  HTTP/  │   Backend    │  Motor  │  Database   │
│             │  WS     │              │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   OpenCV     │
                        │   Camera     │
                        │   Manager    │
                        └──────────────┘
                               │
                        ┌──────┴──────┐
                        ▼             ▼
                  [Webcam]      [IP Camera]
```

### Request Flow

1. **User Authentication**: 
   - User logs in → JWT token issued → Token stored in localStorage
   - All subsequent requests include token in Authorization header

2. **Camera Stream**:
   - User requests camera feed → WebSocket connection established
   - Backend captures frames → Encodes to JPEG → Base64 encode → Send via WebSocket
   - Frontend receives → Decodes → Displays in real-time

3. **Event Detection**:
   - Background thread monitors camera feeds
   - Motion/event detected → Creates event record → Notifies connected clients
   - Optional: Start recording automatically

4. **Recording**:
   - Admin starts recording → Video writer initialized
   - Frames saved to disk → Recording metadata stored in database
   - On stop → File finalized → Available for playback/download

### Major Components

- **Authentication Module**: JWT-based user authentication with role-based permissions
- **Camera Manager**: Handles multiple camera sources (webcam/IP) with threading
- **Video Processor**: OpenCV-based frame capture, processing, and encoding
- **Event Detector**: Simulated AI detection for security events (extensible for real AI models)
- **WebSocket Handler**: Real-time bidirectional communication for video streaming
- **Recording Engine**: Automatic video recording with MP4/AVI output
- **Mock Database**: In-memory fallback when MongoDB unavailable
- **React Dashboard**: Responsive UI with real-time updates

---

## 🧪 Testing

### Run Backend Tests

```bash
# Ensure backend is running on port 8000
python backend_test.py
```

### Run Multi-User Tests

```bash
python test_multi_user.py
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- **Backend**: Follow PEP 8 style guide for Python
- **Frontend**: Use ESLint and Prettier configurations
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 IR RailVision

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🚧 Future Improvements

### Planned Features

- [ ] **AI-Powered Event Detection** - Integration with YOLO/TensorFlow for real object detection
- [ ] **Face Recognition** - Identify known individuals and track unauthorized access
- [ ] **License Plate Recognition** - Vehicle tracking in railway premises
- [ ] **Mobile Application** - iOS and Android apps for on-the-go monitoring
- [ ] **Cloud Storage Integration** - AWS S3/Azure Blob for recording storage
- [ ] **Advanced Analytics** - Heat maps, crowd density analysis, traffic patterns
- [ ] **Multi-Language Support** - Internationalization (i18n)
- [ ] **Email/SMS Alerts** - Automated notifications for critical events
- [ ] **PTZ Camera Control** - Pan-Tilt-Zoom control interface
- [ ] **Video Analytics Dashboard** - Historical data visualization with charts
- [ ] **Integration with Railway Systems** - Train schedule sync, platform occupancy
- [ ] **Edge Computing Support** - Run on edge devices like Raspberry Pi/Jetson Nano
- [ ] **Kubernetes Deployment** - Container orchestration for scalability
- [ ] **GraphQL API** - Alternative to REST for flexible data querying
- [ ] **Progressive Web App (PWA)** - Offline capability and app-like experience

### Technical Improvements

- [ ] **Redis Caching** - Improve performance for frequent queries
- [ ] **Message Queue** - RabbitMQ/Kafka for event processing
- [ ] **Load Balancing** - Nginx/HAProxy for horizontal scaling
- [ ] **Database Sharding** - Handle large-scale deployments
- [ ] **WebRTC Support** - Lower latency video streaming
- [ ] **Microservices Architecture** - Split monolith into services
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Performance Monitoring** - Prometheus/Grafana integration
- [ ] **Security Enhancements** - Rate limiting, DDoS protection, audit logs

---

## 📞 Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/noobremon/Ir-Railvision/issues)
- **Email**: support@railvision.example.com
- **Documentation**: [Wiki](https://github.com/noobremon/Ir-Railvision/wiki)

---

## 🙏 Acknowledgments

- Built with ❤️ for Indian Railways security operations
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Video processing with [OpenCV](https://opencv.org/)

---

<div align="center">
  <strong>Made with 🚂 for Railway Security</strong>
  <br/>
  <sub>Stay Safe, Stay Secure</sub>
</div>
