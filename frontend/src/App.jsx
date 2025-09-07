import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { 
  Camera, 
  Monitor, 
  Shield, 
  AlertTriangle, 
  Users, 
  Play, 
  Square, 
  Settings,
  Eye,
  Bell,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  LogOut,
  Wifi,
  WifiOff,
  VideoOff,
  Video,
  Trash2,
  Edit,
  Download,
  Search,
  Filter,
  RefreshCw,
  Database,
  Server,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

// Use relative API URL to leverage Vite proxy
const API_BASE_URL = '/api';
const API = API_BASE_URL;

// Authentication Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced Login Component
const LoginPage = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(username, password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Railway Video Surveillance System",
      });
    } else {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'operator', password: 'operator123', role: 'Operator' },
    { username: 'security', password: 'security123', role: 'Security Officer' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 center-content p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-30"></div>
      
      {/* Centered Login Container */}
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
          {/* Header Section */}
          <CardHeader className="text-center pt-8 pb-6 px-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Railway VSS</CardTitle>
            <CardDescription className="text-gray-300 text-sm mt-1">
              Video Surveillance System Login
            </CardDescription>
          </CardHeader>
          
          {/* Form Section */}
          <CardContent className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="block text-sm font-medium text-gray-300 ml-1">
                     Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div className="pt-1">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Demo Credentials - Separate Card */}
        <Card className="mt-6 bg-blue-500/10 backdrop-blur-md border-blue-500/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-blue-200 text-center mb-4">Demo Credentials</h3>
            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-blue-500/10 rounded-lg p-3 hover:bg-blue-500/20 transition-colors duration-200"
                >
                  <span className="text-sm text-blue-200 font-medium">
                    {user.username} / {user.password}
                  </span>
                  <span className="text-xs text-blue-300 font-medium bg-blue-500/20 px-2.5 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Video Feed Component
const VideoFeed = ({ camera, isActive, onStart, onStop, onDelete, onEdit }) => {
  const canvasRef = useRef(null);
  const [frameData, setFrameData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [frameCount, setFrameCount] = useState(0);
  const [mockMode, setMockMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (frameData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      
      img.src = `data:image/jpeg;base64,${frameData}`;
    }
  }, [frameData]);

  // Listen for frame updates
  useEffect(() => {
    const handleFrameUpdate = (event) => {
      const frameDetails = event.detail;
      setFrameData(frameDetails.frame);
      setFrameCount(frameDetails.frameCount || 0);
      setMockMode(frameDetails.mock || false);
      setConnectionStatus('connected');
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('frameUpdate', handleFrameUpdate);
      return () => canvas.removeEventListener('frameUpdate', handleFrameUpdate);
    }
  }, []);

  const getStatusColor = () => {
    if (!isActive) return 'bg-gray-500';
    if (connectionStatus === 'connected') return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (!isActive) return 'OFFLINE';
    if (connectionStatus === 'connected') return mockMode ? 'DEMO LIVE' : 'LIVE';
    return 'CONNECTING';
  };

  return (
    <Card className="p-6 hover-lift bg-gray-900 border-gray-700 hover:border-gray-600 rounded-lg shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg flex items-center mb-2">
              <span className="no-text-overflow">{camera.name}</span>
              {mockMode && (
                <Badge variant="secondary" className="ml-3 text-xs bg-blue-500/20 text-blue-400 px-2 py-1">
                  DEMO
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400 flex items-center mb-1">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="no-text-overflow">{camera.location}</span>
            </CardDescription>
            {camera.gps_lat !== 0 && camera.gps_lng !== 0 && (
              <CardDescription className="text-gray-500 text-xs">
                GPS: {camera.gps_lat.toFixed(4)}, {camera.gps_lng.toFixed(4)}
              </CardDescription>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={`${getStatusColor()} text-white px-3 py-1 text-xs font-semibold`}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'animate-pulse' : ''}`}></div>
                {getStatusText()}
              </div>
            </Badge>
            
            <div className="flex gap-2">
              {isActive ? (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={async () => {
                    setIsLoading(true);
                    await onStop(camera.id);
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="h-9 w-9 p-0 bg-red-600 hover:bg-red-700 transition-smooth"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={async () => {
                    setIsLoading(true);
                    await onStart(camera.id);
                    setIsLoading(false);
                  }}
                  disabled={isLoading}
                  className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 transition-smooth"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(camera)} 
                disabled={isLoading}
                className="h-9 w-9 p-0 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-smooth"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDelete(camera.id)} 
                disabled={isLoading}
                className="h-9 w-9 p-0 bg-red-600 hover:bg-red-700 transition-smooth"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
          <canvas
            ref={canvasRef}
            data-camera-id={camera.id}
            className="w-full h-full object-cover"
            style={{ display: frameData ? 'block' : 'none' }}
          />
          {!frameData && isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Activity className="h-8 w-8 animate-pulse mx-auto mb-3" />
                <p className="text-sm font-medium">Connecting...</p>
              </div>
            </div>
          )}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <VideoOff className="h-8 w-8 mx-auto mb-3" />
                <p className="text-sm font-medium">Camera Offline</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
          <span className="font-medium">
            Source: <span className="text-gray-300">{camera.source}</span>
          </span>
          <div className="flex items-center gap-3">
            {isActive && frameCount > 0 && (
              <span className="text-xs">
                Frames: <span className="text-white font-medium">{frameCount}</span>
              </span>
            )}
            {mockMode && (
              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1">
                DEMO
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Complete Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [cameras, setCameras] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [activeCameras, setActiveCameras] = useState(new Set());
  const [cameraFilter, setCameraFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [isEditCameraOpen, setIsEditCameraOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    source: '0',
    gps_lat: 0,
    gps_lng: 0
  });
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // Fetch initial data
      await Promise.all([
        fetchCameras(),
        fetchEvents(),
        fetchStats()
      ]);
      
      // Connect WebSocket after a brief delay to ensure backend is ready
      setTimeout(() => {
        connectWebSocket();
      }, 1000);
    };
    
    initializeApp();

    // Set up periodic updates
    const statsInterval = setInterval(fetchStats, 10000);
    const eventsInterval = setInterval(fetchEvents, 30000);

    // Handle page unload to properly close WebSocket
    const handleBeforeUnload = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Page unloading');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(statsInterval);
      clearInterval(eventsInterval);
      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      // Properly close WebSocket on cleanup
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.close(1000, 'Component unmounting');
        }
        wsRef.current = null;
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          console.log('WebSocket already connected');
          return;
        }
        if (wsRef.current.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket connection in progress');
          return;
        }
      }
      
      const wsUrl = 'ws://localhost:8000/api/ws';
      console.log('Attempting WebSocket connection to:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setConnectionStatus('connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'video_frames') {
            // Handle multiple camera frames
            data.data.forEach(frameData => {
              const canvas = document.querySelector(`canvas[data-camera-id="${frameData.camera_id}"]`);
              if (canvas) {
                const frameUpdateEvent = new CustomEvent('frameUpdate', { 
                  detail: {
                    frame: frameData.frame,
                    frameCount: frameData.frame_count,
                    mock: frameData.mock
                  }
                });
                canvas.dispatchEvent(frameUpdateEvent);
              }
            });
          } else if (data.type === 'event') {
            setEvents(prev => [data.data, ...prev]);
            fetchStats();
            toast({
              title: "New Security Event",
              description: `${data.data.event_type} detected at ${data.data.camera_name}`,
              variant: "destructive",
            });
          } else if (data.type === 'connection') {
            console.log('WebSocket connection confirmed:', data);
          } else if (data.type === 'heartbeat') {
            // Heartbeat received - only log occasionally
            if (Math.random() < 0.1) { // Log only 10% of heartbeats
              console.log('WebSocket heartbeat active');
            }
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        setConnectionStatus('disconnected');
        wsRef.current = null;
        
        // Clear any existing reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Only attempt reconnection if it wasn't a manual close (code 1000) or browser going away (code 1001)
        if (event.code !== 1000 && event.code !== 1001 && event.reason !== 'Component unmounting') {
          console.log('Attempting to reconnect WebSocket in 5 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 5000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        setConnectionStatus('error');
      };
      
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setConnectionStatus('error');
      
      // Retry connection after 10 seconds on initialization error
      setTimeout(() => {
        console.log('Retrying WebSocket connection...');
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          connectWebSocket();
        }
      }, 10000);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/cameras`);
      setCameras(response.data);
      console.log('Cameras loaded successfully:', response.data.length);
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      if (error.response?.status === 401) {
        console.log('Authentication required for cameras');
      } else {
        toast({
          title: "Failed to Load Cameras",
          description: "Unable to fetch camera list",
          variant: "destructive",
        });
      }
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data);
      console.log('Events loaded successfully:', response.data.length);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      if (error.response?.status !== 401) {
        toast({
          title: "Failed to Load Events",
          description: "Unable to fetch event list",
          variant: "destructive",
        });
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
      console.log('Stats loaded successfully');
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      if (error.response?.status !== 401) {
        toast({
          title: "Failed to Load Statistics",
          description: "Unable to fetch dashboard statistics",
          variant: "destructive",
        });
      }
    }
  };

  const startCamera = async (cameraId) => {
    try {
      // Optimistically update UI first for immediate feedback
      setActiveCameras(prev => new Set([...prev, cameraId]));
      
      const response = await axios.post(`${API}/cameras/${cameraId}/start`);
      
      // Update stats without waiting
      fetchStats();
      
      toast({
        title: "Camera Started",
        description: "Camera feed activated successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      
      toast({
        title: "Failed to Start Camera",
        description: error.response?.data?.detail || "Camera activation failed",
        variant: "destructive",
      });
    }
  };

  const stopCamera = async (cameraId) => {
    try {
      // Optimistically update UI first for immediate feedback
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      
      const response = await axios.post(`${API}/cameras/${cameraId}/stop`);
      
      // Update stats without waiting
      fetchStats();
      
      toast({
        title: "Camera Stopped",
        description: "Camera feed deactivated",
      });
    } catch (error) {
      // Revert optimistic update on error
      setActiveCameras(prev => new Set([...prev, cameraId]));
      
      toast({
        title: "Failed to Stop Camera",
        description: error.response?.data?.detail || "Camera deactivation failed",
        variant: "destructive",
      });
    }
  };

  const deleteCamera = async (cameraId) => {
    if (!window.confirm('Are you sure you want to delete this camera?')) return;
    
    try {
      await axios.delete(`${API}/cameras/${cameraId}`);
      setCameras(prev => prev.filter(cam => cam.id !== cameraId));
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      fetchStats();
      
      toast({
        title: "Camera Deleted",
        description: "Camera has been removed from the system",
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Camera",
        description: error.response?.data?.detail || "Camera deletion failed",
        variant: "destructive",
      });
    }
  };

  const editCamera = (camera) => {
    setEditingCamera(camera);
    setIsEditCameraOpen(true);
  };

  const handleUpdateCamera = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/cameras/${editingCamera.id}`, editingCamera);
      setIsEditCameraOpen(false);
      setEditingCamera(null);
      fetchCameras();
      
      toast({
        title: "Camera Updated",
        description: "Camera has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.detail || "Failed to update camera",
        variant: "destructive",
      });
    }
  };

  const handleAddCamera = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/cameras`, newCamera);
      setIsAddCameraOpen(false);
      setNewCamera({ name: '', location: '', source: '0', gps_lat: 0, gps_lng: 0 });
      fetchCameras();
      fetchStats();
      
      toast({
        title: "Camera Added",
        description: "New camera has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to Add Camera",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const acknowledgeEvent = async (eventId) => {
    try {
      await axios.put(`${API}/events/${eventId}/acknowledge`);
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, is_acknowledged: true, acknowledged_by: user?.username } : event
      ));
      fetchStats();
      
      toast({
        title: "Event Acknowledged",
        description: "Event has been marked as acknowledged",
      });
    } catch (error) {
      toast({
        title: "Acknowledgment Failed",
        description: error.response?.data?.detail || "Failed to acknowledge event",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'unacknowledged') return !event.is_acknowledged;
    return event.event_type === eventFilter;
  });

  // Filter cameras
  const filteredCameras = cameras.filter(camera => {
    if (cameraFilter === 'all') return true;
    if (cameraFilter === 'active') return activeCameras.has(camera.id);
    if (cameraFilter === 'inactive') return !activeCameras.has(camera.id);
    return true;
  });

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-400" />;
      default:
        return <WifiOff className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Enhanced Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-8 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
              <Shield className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Railway Video Surveillance System</h1>
              <p className="text-base text-gray-400">Real-time monitoring and security</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700">
              {getConnectionStatusIcon()}
              <span className="capitalize text-base font-medium text-gray-300">{connectionStatus}</span>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2 text-base font-medium">
              {user?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-gray-300 font-semibold text-base">{user?.username}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 px-5 py-3 text-base"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Standardized KPI Stats Cards */}
      <div className="layout-container">
        <div className="layout-grid layout-grid-kpi mb-8">
          <div className="kpi-card hover-lift border-gray-700 hover:border-blue-500/50">
            <div className="kpi-content">
              <div className="kpi-label">Total Cameras</div>
              <div className="kpi-value">{stats.total_cameras || 0}</div>
              <div className="kpi-description">System capacity</div>
            </div>
            <div className="kpi-icon bg-blue-500/20">
              <Camera className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="kpi-card hover-lift border-gray-700 hover:border-green-500/50">
            <div className="kpi-content">
              <div className="kpi-label">Active Cameras</div>
              <div className="kpi-value text-green-400">{stats.active_cameras || 0}</div>
              <div className="kpi-description">Currently monitoring</div>
            </div>
            <div className="kpi-icon bg-green-500/20">
              <Monitor className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="kpi-card hover-lift border-gray-700 hover:border-yellow-500/50">
            <div className="kpi-content">
              <div className="kpi-label">Today's Events</div>
              <div className="kpi-value text-yellow-400">{stats.today_events || 0}</div>
              <div className="kpi-description">Security incidents</div>
            </div>
            <div className="kpi-icon bg-yellow-500/20">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="kpi-card hover-lift border-gray-700 hover:border-red-500/50">
            <div className="kpi-content">
              <div className="kpi-label">Unacknowledged</div>
              <div className="kpi-value text-red-400">{stats.unacknowledged_events || 0}</div>
              <div className="kpi-description">Require attention</div>
            </div>
            <div className="kpi-icon bg-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Tabs */}
        <Tabs defaultValue="cameras" className="space-y-8">
          <TabsList className="bg-gray-900 border-gray-700 p-1 rounded-xl">
            <TabsTrigger 
              value="cameras" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-smooth px-6 py-3 rounded-lg font-semibold"
            >
              <Camera className="h-4 w-4 mr-2" />
              Live Cameras ({cameras.length})
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-smooth px-6 py-3 rounded-lg font-semibold"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Events ({events.length})
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-smooth px-6 py-3 rounded-lg font-semibold"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cameras" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-title text-white">Camera Management</h2>
                <p className="text-subtitle">Monitor and control surveillance cameras</p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={cameraFilter} onValueChange={setCameraFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Cameras</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role === 'admin' && (
                  <Button 
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white" 
                    onClick={() => setIsAddCameraOpen(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Camera
                  </Button>
                )}
              </div>
            </div>

            {filteredCameras.length === 0 ? (
              <Card className="p-8 text-center bg-gray-900 border-gray-700 rounded-lg shadow-md">
                <CardContent className="space-y-6">
                  <Camera className="h-16 w-16 text-gray-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Cameras Available</h3>
                    <p className="text-gray-500">Add cameras to start monitoring railway operations.</p>
                  </div>
                  {user?.role === 'admin' && (
                    <Button 
                      onClick={() => setIsAddCameraOpen(true)} 
                      className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Add Your First Camera
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid-consistent grid-cards">
                {filteredCameras.map((camera) => (
                  <VideoFeed
                    key={camera.id}
                    camera={camera}
                    isActive={activeCameras.has(camera.id)}
                    onStart={startCamera}
                    onStop={stopCamera}
                    onDelete={deleteCamera}
                    onEdit={editCamera}
                  />
                ))}
              </div>
            )}

            {/* Add Camera Dialog */}
            <Dialog open={isAddCameraOpen} onOpenChange={setIsAddCameraOpen}>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-lg">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-semibold">Add New Camera</DialogTitle>
                  <DialogDescription className="text-gray-400 text-base">
                    Configure a new camera for the surveillance system.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCamera} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold text-gray-200">Camera Name</Label>
                    <Input
                      id="name"
                      value={newCamera.name}
                      onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 text-base"
                      placeholder="Platform 1 Camera"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-base font-semibold text-gray-200">Location</Label>
                    <Input
                      id="location"
                      value={newCamera.location}
                      onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 text-base"
                      placeholder="Platform 1, Main Station"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="source" className="text-base font-semibold text-gray-200">Camera Source</Label>
                    <Select 
                      value={newCamera.source} 
                      onValueChange={(value) => setNewCamera({...newCamera, source: value})}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="0">Default Webcam (0)</SelectItem>
                        <SelectItem value="1">USB Camera (1)</SelectItem>
                        <SelectItem value="2">USB Camera (2)</SelectItem>
                        <SelectItem value="rtsp://192.168.1.100:554/stream">IP Camera (RTSP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="gps_lat" className="text-base font-semibold text-gray-200">GPS Latitude</Label>
                      <Input
                        id="gps_lat"
                        type="number"
                        step="any"
                        value={newCamera.gps_lat}
                        onChange={(e) => setNewCamera({...newCamera, gps_lat: parseFloat(e.target.value) || 0})}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 text-base"
                        placeholder="28.6139"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="gps_lng" className="text-base font-semibold text-gray-200">GPS Longitude</Label>
                      <Input
                        id="gps_lng"
                        type="number"
                        step="any"
                        value={newCamera.gps_lng}
                        onChange={(e) => setNewCamera({...newCamera, gps_lng: parseFloat(e.target.value) || 0})}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 h-12 px-4 text-base"
                        placeholder="77.2090"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-6">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200 h-12 font-semibold text-base"
                    >
                      Add Camera
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddCameraOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 h-12 px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Camera Dialog */}
            {editingCamera && (
              <Dialog open={isEditCameraOpen} onOpenChange={setIsEditCameraOpen}>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Edit Camera</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Update camera configuration.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateCamera} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Camera Name</Label>
                      <Input
                        id="edit-name"
                        value={editingCamera.name}
                        onChange={(e) => setEditingCamera({...editingCamera, name: e.target.value})}
                        className="bg-gray-800 border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-location">Location</Label>
                      <Input
                        id="edit-location"
                        value={editingCamera.location}
                        onChange={(e) => setEditingCamera({...editingCamera, location: e.target.value})}
                        className="bg-gray-800 border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-source">Camera Source</Label>
                      <Input
                        id="edit-source"
                        value={editingCamera.source}
                        onChange={(e) => setEditingCamera({...editingCamera, source: e.target.value})}
                        className="bg-gray-800 border-gray-600"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-gps-lat">GPS Latitude</Label>
                        <Input
                          id="edit-gps-lat"
                          type="number"
                          step="any"
                          value={editingCamera.gps_lat}
                          onChange={(e) => setEditingCamera({...editingCamera, gps_lat: parseFloat(e.target.value) || 0})}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-gps-lng">GPS Longitude</Label>
                        <Input
                          id="edit-gps-lng"
                          type="number"
                          step="any"
                          value={editingCamera.gps_lng}
                          onChange={(e) => setEditingCamera({...editingCamera, gps_lng: parseFloat(e.target.value) || 0})}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Update Camera
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditCameraOpen(false)} className="border-gray-600">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            <div className="flex justify-between items-center flex-wrap gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Security Events</h2>
                <p className="text-gray-400 text-lg">Monitor and manage security incidents</p>
              </div>
              <div className="flex items-center space-x-6">
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-56 bg-gray-800 border-gray-600 h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                    <SelectItem value="motion_detected">Motion</SelectItem>
                    <SelectItem value="person_detected">Person</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={fetchEvents} 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 px-6 py-3 text-base"
                >
                  <RefreshCw className="h-5 w-5 mr-3" />
                  Refresh
                </Button>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700 shadow-xl">
                <CardContent className="p-16 text-center">
                  <AlertTriangle className="h-20 w-20 text-gray-600 mx-auto mb-8" />
                  <h3 className="text-2xl font-semibold text-gray-400 mb-4">No Events Found</h3>
                  <p className="text-gray-500 text-lg">No security events match the current filter.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-700 shadow-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 bg-gray-800/50">
                      <TableHead className="text-gray-300 font-semibold py-6 text-base">Time</TableHead>
                      <TableHead className="text-gray-300 font-semibold py-6 text-base">Camera</TableHead>
                      <TableHead className="text-gray-300 font-semibold py-6 text-base">Event Type</TableHead>
                      <TableHead className="text-gray-300 font-semibold py-6 text-base">Status</TableHead>
                      <TableHead className="text-gray-300 font-semibold py-6 text-base">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id} className="border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <TableCell className="text-gray-300 py-6">
                          <div className="flex items-center space-x-4">
                            <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <span className="text-base">{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 py-6">
                          <span className="font-semibold text-base">{event.camera_name}</span>
                        </TableCell>
                        <TableCell className="py-6">
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 px-4 py-2 font-semibold text-base">
                            {event.event_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6">
                          {event.is_acknowledged ? (
                            <Badge variant="default" className="bg-green-500/20 text-green-400 px-4 py-2 font-semibold text-base">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400 px-4 py-2 font-semibold text-base">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex space-x-3">
                            {!event.is_acknowledged && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => acknowledgeEvent(event.id)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 px-4 py-2 text-base"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Acknowledge
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="layout-spacing-lg">
            <div className="flex-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-heading-lg text-white">System Settings</h2>
                <p className="text-subtitle">System configuration and user management</p>
              </div>
            </div>

            <div className="layout-container">
              <div className="layout-grid layout-grid-responsive">
                {/* User Profile Card */}
                <div className="card-standard card-hover">
                  <div className="flex-start mb-4">
                    <Users className="h-5 w-5 mr-3 text-blue-400" />
                    <div>
                      <h3 className="text-heading-sm text-white">User Profile</h3>
                      <p className="text-body-sm text-gray-400">Manage your account settings</p>
                    </div>
                  </div>
                  <div className="layout-spacing">
                    <div className="flex-between py-3">
                      <span className="text-body text-gray-400 font-medium">Username</span>
                      <span className="text-body text-white font-semibold">{user?.username}</span>
                    </div>
                    <div className="flex-between py-3 border-t border-gray-700">
                      <span className="text-body text-gray-400 font-medium">Email</span>
                      <span className="text-body text-white font-semibold">{user?.email}</span>
                    </div>
                    <div className="flex-between py-3 border-t border-gray-700">
                      <span className="text-body text-gray-400 font-medium">Role</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 px-3 py-1 font-medium">
                        {user?.role?.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-between py-3 border-t border-gray-700">
                      <span className="text-body text-gray-400 font-medium">Status</span>
                      <Badge variant="default" className="bg-green-500/20 text-green-400 px-3 py-1 font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              
              {/* System Status Card */}
              <Card className="bg-gray-900 border-gray-700 shadow-xl hover:border-gray-600 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center text-lg">
                    <Server className="h-5 w-5 mr-3 text-green-400" />
                    System Status
                  </CardTitle>
                  <CardDescription className="text-gray-400">Current system health and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400 font-medium">Backend</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-400 px-3 py-1 font-medium">
                      <Database className="h-3 w-3 mr-2" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-700">
                    <span className="text-gray-400 font-medium">Database</span>
                    <Badge 
                      variant={stats.system_health?.database === 'online' ? 'default' : 'secondary'} 
                      className={stats.system_health?.database === 'online' ? 'bg-green-500/20 text-green-400 px-3 py-1 font-medium' : 'bg-yellow-500/20 text-yellow-400 px-3 py-1 font-medium'}
                    >
                      {stats.system_health?.database === 'online' ? 'Connected' : 'Mock Mode'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-700">
                    <span className="text-gray-400 font-medium">WebSocket</span>
                    <Badge 
                      variant={connectionStatus === 'connected' ? 'default' : 'destructive'} 
                      className={connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400 px-3 py-1 font-medium' : 'bg-red-500/20 text-red-400 px-3 py-1 font-medium'}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-700">
                    <span className="text-gray-400 font-medium">Active Cameras</span>
                    <span className="text-white font-semibold">{stats.active_cameras || 0}/{stats.total_cameras || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* System Health Overview */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Health
                  </CardTitle>
                  <CardDescription className="text-gray-400">Overall system performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Video Processing</span>
                    <Badge variant={stats.system_health?.video_processing === 'active' ? 'default' : 'secondary'}
                           className={stats.system_health?.video_processing === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {stats.system_health?.video_processing === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Storage</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-400">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Connected Clients</span>
                    <span className="text-white font-medium">{stats.connected_clients || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">System Version</span>
                    <span className="text-white font-medium">v1.0.0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Events Summary Card */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Events Summary
                  </CardTitle>
                  <CardDescription className="text-gray-400">Recent security events overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Today's Events</span>
                    <span className="text-white font-medium">{stats.today_events || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Unacknowledged</span>
                    <Badge variant={stats.unacknowledged_events > 0 ? 'destructive' : 'default'}
                           className={stats.unacknowledged_events > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                      {stats.unacknowledged_events || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Events</span>
                    <span className="text-white font-medium">{Object.values(stats.events_by_type || {}).reduce((a, b) => a + b, 0)}</span>
                  </div>
                  {stats.events_by_type && Object.keys(stats.events_by_type).length > 0 && (
                    <div className="pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">Most Common:</span>
                      <div className="mt-1">
                        {Object.entries(stats.events_by_type)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 2)
                          .map(([type, count]) => (
                            <div key={type} className="flex justify-between text-sm">
                              <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                              <span className="text-white">{count}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Information Card */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    System Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">Technical system details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Frontend</span>
                    <span className="text-white font-medium">React + Vite</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Backend</span>
                    <span className="text-white font-medium">FastAPI + Python</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database</span>
                    <span className="text-white font-medium">MongoDB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Authentication</span>
                    <span className="text-white font-medium">JWT Tokens</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Real-time</span>
                    <span className="text-white font-medium">WebSockets</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="bg-gray-900 border-gray-700 shadow-xl hover:border-gray-600 transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-3 text-purple-400" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-400">System administration tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 h-12 px-4"
                    onClick={() => {
                      fetchStats();
                      fetchCameras();
                      fetchEvents();
                      toast({
                        title: "System Refreshed",
                        description: "All data has been reloaded",
                      });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-3" />
                    <span className="font-medium">Refresh System Data</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 h-12 px-4"
                    onClick={() => {
                      // Clear any existing timeouts
                      if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                      }
                      // Force WebSocket reconnection
                      if (wsRef.current) {
                        wsRef.current.close();
                        wsRef.current = null;
                      }
                      setTimeout(() => connectWebSocket(), 1000);
                      toast({
                        title: "WebSocket Reconnected",
                        description: "Real-time connection refreshed",
                      });
                    }}
                  >
                    <Wifi className="h-4 w-4 mr-3" />
                    <span className="font-medium">Reconnect WebSocket</span>
                  </Button>
                  
                  {user?.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 h-12 px-4"
                      onClick={() => {
                        toast({
                          title: "Export Data",
                          description: "System data export feature coming soon",
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-3" />
                      <span className="font-medium">Export System Data</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-500/20 p-4 rounded-2xl inline-block mb-4">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
          </div>
          <p className="text-gray-400 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

export default App;