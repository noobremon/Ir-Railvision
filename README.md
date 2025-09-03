# Railway Video Surveillance System

A comprehensive video surveillance system built with FastAPI backend and React frontend.

## 🔧 Fixes Applied

### Critical Issues Fixed:
- ✅ **Framework Conflict**: Removed Flask components, using FastAPI exclusively
- ✅ **Port Mismatch**: Updated frontend to connect to FastAPI (port 8000)
- ✅ **Missing Environment**: Added proper `.env` configuration
- ✅ **Dependency Management**: Added complete `requirements.txt`

### Minor Issues Fixed:
- ✅ **JWT Import Error**: Fixed PyJWTError import
- ✅ **Environment Variables**: Added fallback values for missing env vars
- ✅ **CORS Configuration**: Improved cross-origin setup
- ✅ **Error Handling**: Enhanced WebSocket and video processing error handling
- ✅ **Code Quality**: Removed unused imports and files

## 🚀 Quick Start

### Backend Setup:
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Environment Configuration

Create `backend/.env` with:
```env
MONGO_URL=mongodb://localhost:27017/railway_surveillance
DB_NAME=railway_surveillance
JWT_SECRET=your_secret_key_here
HOST=0.0.0.0
PORT=8000
```

## 🌐 Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/api/ws

## 📋 Default Users
- Admin: `admin/admin123`
- Operator: `operator/operator123`
- Security: `security/security123`

## ✅ What's Working Now
- ✅ Clean FastAPI backend without Flask conflicts
- ✅ Proper frontend-backend communication
- ✅ Enhanced error handling
- ✅ Environment configuration
- ✅ Complete development setup