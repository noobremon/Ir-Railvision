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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { username, password });
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
      await axios.post(`${API}/auth/logout`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-30"></div>
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Railway VSS</CardTitle>
          <CardDescription className="text-gray-300">
            Video Surveillance System Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Enter password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            {demoUsers.map((user, index) => (
              <div key={index} className="text-xs text-blue-200 mb-1 flex justify-between">
                <span>{user.username} / {user.password}</span>
                <span className="text-blue-300">({user.role})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
      setFrameData(event.detail);
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
    <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg flex items-center">
              {camera.name}
              {mockMode && <Badge variant="secondary" className="ml-2 text-xs">DEMO</Badge>}
            </CardTitle>
            <CardDescription className="text-gray-400 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {camera.location}
            </CardDescription>
            {camera.gps_lat !== 0 && camera.gps_lng !== 0 && (
              <CardDescription className="text-gray-500 text-xs">
                GPS: {camera.gps_lat.toFixed(4)}, {camera.gps_lng.toFixed(4)}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isActive ? "default" : "secondary"} className={`${getStatusColor()} text-white`}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${isActive ? 'animate-pulse' : ''}`}></div>
                {getStatusText()}
              </div>
            </Badge>
            <div className="flex space-x-1">
              {isActive ? (
                <Button size="sm" variant="destructive" onClick={() => onStop(camera.id)}>
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="sm" variant="default" onClick={() => onStart(camera.id)}>
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => onEdit(camera)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(camera.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <canvas
            ref={canvasRef}
            data-camera-id={camera.id}
            className="w-full h-full object-cover"
            style={{ display: frameData ? 'block' : 'none' }}
          />
          {!frameData && isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Activity className="h-8 w-8 animate-pulse mx-auto mb-2" />
                <p>Connecting...</p>
              </div>
            </div>
          )}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mb-2 mx-auto" />
                <p>Camera Offline</p>
              </div>
            </div>
          )}
          {frameCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              Frame: {frameCount}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Dashboard Component
const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [activeCameras, setActiveCameras] = useState(new Set());
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [isEditCameraOpen, setIsEditCameraOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('all');
  const [cameraFilter, setCameraFilter] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    source: '0',
    gps_lat: 0,
    gps_lng: 0
  });
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    fetchCameras();
    fetchEvents();
    fetchStats();
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const connectWebSocket = useCallback(() => {
    const wsUrl = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    wsRef.current = new WebSocket(`${wsUrl}/api/ws`);

    wsRef.current.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'video_frames') {
          // Update video frames for each camera
          data.data.forEach(frame => {
            const canvas = document.querySelector(`[data-camera-id="${frame.camera_id}"]`);
            if (canvas) {
              const event = new CustomEvent('frameUpdate', { detail: frame.frame });
              canvas.dispatchEvent(event);
              
              // Update frame count and mock status
              if (frame.frame_count) {
                // Update frame count display if needed
              }
            }
          });
        } else if (data.type === 'event') {
          // New event received
          setEvents(prev => [data.data, ...prev.slice(0, 99)]);
          fetchStats(); // Update stats
          
          const eventTypeColors = {
            motion: "info",
            intrusion: "destructive", 
            drowsiness: "default",
            panic: "destructive",
            crowd_gathering: "default"
          };
          
          toast({
            title: "🚨 Security Alert",
            description: `${data.data.event_type.toUpperCase()}: ${data.data.description}`,
            variant: eventTypeColors[data.data.event_type] || "default",
          });
        } else if (data.type === 'connection') {
          console.log('WebSocket connection confirmed');
        } else if (data.type === 'heartbeat') {
          // Handle heartbeat
          console.log('Heartbeat received');
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    wsRef.current.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected, attempting to reconnect...');
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };
  }, [toast]);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/cameras`);
      setCameras(response.data);
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cameras",
        variant: "destructive",
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events?limit=50`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStartCamera = async (cameraId) => {
    try {
      const response = await axios.post(`${API}/cameras/${cameraId}/start`);
      setActiveCameras(prev => new Set([...prev, cameraId]));
      
      toast({
        title: "Camera Started",
        description: response.data.mock_mode 
          ? "Camera started in demo mode with mock feed" 
          : "Camera is now live and monitoring",
        variant: response.data.mock_mode ? "default" : "default",
      });
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      toast({
        title: "Camera Start Failed",
        description: error.response?.data?.detail || "Failed to start camera",
        variant: "destructive",
      });
    }
  };

  const handleStopCamera = async (cameraId) => {
    try {
      await axios.post(`${API}/cameras/${cameraId}/stop`);
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      
      toast({
        title: "Camera Stopped",
        description: "Camera has been stopped",
      });
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      toast({
        title: "Camera Stop Failed",
        description: error.response?.data?.detail || "Failed to stop camera",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    if (window.confirm('Are you sure you want to delete this camera? This action cannot be undone.')) {
      try {
        await axios.delete(`${API}/cameras/${cameraId}`);
        fetchCameras();
        fetchStats();
        
        toast({
          title: "Camera Deleted",
          description: "Camera has been deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: error.response?.data?.detail || "Failed to delete camera",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setIsEditCameraOpen(true);
  };

  const handleUpdateCamera = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/cameras/${editingCamera.id}`, {
        name: editingCamera.name,
        location: editingCamera.location,
        source: editingCamera.source,
        gps_lat: editingCamera.gps_lat,
        gps_lng: editingCamera.gps_lng
      });
      
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
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Railway Video Surveillance System</h1>
              <p className="text-sm text-gray-400">Real-time monitoring and security</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              {getConnectionStatusIcon()}
              <span className="capitalize">{connectionStatus}</span>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {user?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-gray-300">{user?.username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Cameras</p>
                  <p className="text-2xl font-bold text-white">{stats.total_cameras || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">System capacity</p>
                </div>
                <Camera className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Cameras</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active_cameras || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently monitoring</p>
                </div>
                <Monitor className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 hover:border-yellow-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Today's Events</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.today_events || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Security incidents</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 hover:border-red-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Unacknowledged</p>
                  <p className="text-2xl font-bold text-red-400">{stats.unacknowledged_events || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Require attention</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Enhanced Tabs */}
        <Tabs defaultValue="cameras" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="cameras" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Camera className="h-4 w-4 mr-2" />
              Live Cameras ({cameras.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Events ({events.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cameras" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Camera Management</h2>
                <p className="text-gray-400">Monitor and control surveillance cameras</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={cameraFilter} onValueChange={setCameraFilter}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Cams</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role === 'admin' && (
                  <Dialog open={isAddCameraOpen} onOpenChange={setIsAddCameraOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Camera
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Add New Camera</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Configure a new camera for the surveillance system.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCamera} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Camera Name</Label>
                          <Input
                            id="name"
                            value={newCamera.name}
                            onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                            placeholder="Platform 1 Camera"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newCamera.location}
                            onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                            placeholder="Platform 1, Main Station"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="source">Camera Source</Label>
                          <Select 
                            value={newCamera.source} 
                            onValueChange={(value) => setNewCamera({...newCamera, source: value})}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="0">Default Webcam (0)</SelectItem>
                              <SelectItem value="1">USB Camera (1)</SelectItem>
                              <SelectItem value="rtsp://192.168.1.100:554/stream">IP Camera (RTSP)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gps_lat">GPS Latitude</Label>
                            <Input
                              id="gps_lat"
                              type="number"
                              step="any"
                              value={newCamera.gps_lat}
                              onChange={(e) => setNewCamera({...newCamera, gps_lat: parseFloat(e.target.value) || 0})}
                              className="bg-gray-800 border-gray-600"
                              placeholder="28.6139"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gps_lng">GPS Longitude</Label>
                            <Input
                              id="gps_lng"
                              type="number"
                              step="any"
                              value={newCamera.gps_lng}
                              onChange={(e) => setNewCamera({...newCamera, gps_lng: parseFloat(e.target.value) || 0})}
                              className="bg-gray-800 border-gray-600"
                              placeholder="77.2090"
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          Add Camera
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

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

            {filteredCameras.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Cameras Available</h3>
                  <p className="text-gray-500 mb-4">Add cameras to start monitoring railway operations.</p>
                  {user?.role === 'admin' && (
                    <Button onClick={() => setIsAddCameraOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Add Your First Camera
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCameras.map((camera) => (
                  <VideoFeed
                    key={camera.id}
                    camera={camera}
                    isActive={activeCameras.has(camera.id)}
                    onStart={handleStartCamera}
                    onStop={handleStopCamera}
                    onDelete={handleDeleteCamera}
                    onEdit={handleEditCamera}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Security Events</h2>
                <p className="text-gray-400">Monitor and manage security incidents</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                    <SelectItem value="motion">Motion</SelectItem>
                    <SelectItem value="intrusion">Intrusion</SelectItem>
                    <SelectItem value="drowsiness">Drowsiness</SelectItem>
                    <SelectItem value="panic">Panic</SelectItem>
                    <SelectItem value="crowd_gathering">Crowd Gathering</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchEvents} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Time</TableHead>
                        <TableHead className="text-gray-400">Event Type</TableHead>
                        <TableHead className="text-gray-400">Camera</TableHead>
                        <TableHead className="text-gray-400">Description</TableHead>
                        <TableHead className="text-gray-400">Confidence</TableHead>
                        <TableHead className="text-gray-400">Severity</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="text-gray-300">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div>{new Date(event.timestamp).toLocaleTimeString()}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(event.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                event.event_type === 'motion' ? 'secondary' : 
                                event.event_type === 'intrusion' ? 'destructive' :
                                event.event_type === 'panic' ? 'destructive' :
                                'default'
                              }
                              className="capitalize"
                            >
                              {event.event_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <div>
                              <div className="font-medium">{event.camera_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{event.camera_id.slice(0, 8)}...</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-xs truncate">{event.description}</TableCell>
                          <TableCell className="text-gray-300">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${event.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{Math.round(event.confidence * 100)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              event.severity === 'critical' ? 'destructive' :
                              event.severity === 'high' ? 'destructive' :
                              event.severity === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {event.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {event.is_acknowledged ? (
                              <Badge variant="default" className="bg-green-500/20 text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Acknowledged
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {!event.is_acknowledged && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => acknowledgeEvent(event.id)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredEvents.length === 0 && (
                  <div className="p-12 text-center">
                    <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
                    <p className="text-gray-500">
                      {eventFilter === 'all' 
                        ? 'Security events will appear here when detected.' 
                        : `No ${eventFilter} events found. Try changing the filter.`
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                <p className="text-gray-400">System configuration and information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">Your account details and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Username</Label>
                    <p className="text-white font-medium">{user?.username}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Role</Label>
                    <Badge variant="secondary" className="ml-2">
                      {user?.role?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-400">Account Status</Label>
                    <p className="text-green-400 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    System Status
                  </CardTitle>
                  <CardDescription className="text-gray-400">Current system health and connectivity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">WebSocket Connection</span>
                    <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} 
                           className={connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : ''}>
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-400">
                      <Database className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Video Processing</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-400">
                      <Video className="h-3 w-3 mr-1" />
                      Active
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

              {/* System Health Overview */}
              <Card className="bg-gray-900 border-gray-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Health Overview
                  </CardTitle>
                  <CardDescription className="text-gray-400">Overall system performance and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Monitor className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Active Cameras</p>
                      <p className="text-xl font-bold text-white">{stats.active_cameras || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Today's Events</p>
                      <p className="text-xl font-bold text-white">{stats.today_events || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Online Users</p>
                      <p className="text-xl font-bold text-white">{stats.connected_clients || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <Database className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Storage</p>
                      <p className="text-xl font-bold text-white">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/" element={<ProtectedRoute />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

const LoginComponent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <div className="text-white">Loading Railway VSS...</div>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <LoginPage />;
};

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <div className="text-white">Loading Dashboard...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Dashboard />;
};

export default App;