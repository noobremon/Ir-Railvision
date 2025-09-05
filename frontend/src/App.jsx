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
                <VideoOff className="h-8 w-8 mx-auto mb-2" />
                <p>Camera Offline</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span>Source: {camera.source}</span>
          {isActive && frameCount > 0 && (
            <span>Frames: {frameCount}</span>
          )}
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

  // Fetch data on component mount
  useEffect(() => {
    fetchCameras();
    fetchEvents();
    fetchStats();
    connectWebSocket();

    // Set up periodic updates
    const statsInterval = setInterval(fetchStats, 10000);
    const eventsInterval = setInterval(fetchEvents, 30000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(eventsInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const wsUrl = 'ws://localhost:8000/api/ws';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'camera_frame') {
            const canvas = document.querySelector(`canvas[data-camera-id="${data.camera_id}"]`);
            if (canvas) {
              const frameUpdateEvent = new CustomEvent('frameUpdate', { detail: data.frame });
              canvas.dispatchEvent(frameUpdateEvent);
            }
          } else if (data.type === 'new_event') {
            setEvents(prev => [data.event, ...prev]);
            fetchStats();
            toast({
              title: "New Security Event",
              description: `${data.event.event_type} detected at ${data.event.camera_name}`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${API}/cameras`);
      setCameras(response.data);
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      toast({
        title: "Failed to Load Cameras",
        description: "Unable to fetch camera list",
        variant: "destructive",
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
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

  const startCamera = async (cameraId) => {
    try {
      await axios.post(`${API}/cameras/${cameraId}/start`);
      setActiveCameras(prev => new Set([...prev, cameraId]));
      fetchStats();
      
      toast({
        title: "Camera Started",
        description: "Camera feed activated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to Start Camera",
        description: error.response?.data?.detail || "Camera activation failed",
        variant: "destructive",
      });
    }
  };

  const stopCamera = async (cameraId) => {
    try {
      await axios.post(`${API}/cameras/${cameraId}/stop`);
      setActiveCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      fetchStats();
      
      toast({
        title: "Camera Stopped",
        description: "Camera feed deactivated",
      });
    } catch (error) {
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
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddCameraOpen(true)}>
                    <Camera className="h-4 w-4 mr-2" />
                    Add Camera
                  </Button>
                )}
              </div>
            </div>

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
                    onStart={startCamera}
                    onStop={stopCamera}
                    onDelete={deleteCamera}
                    onEdit={editCamera}
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                    <SelectItem value="motion_detected">Motion</SelectItem>
                    <SelectItem value="person_detected">Person</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchEvents} className="border-gray-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Events Found</h3>
                  <p className="text-gray-500">No security events match the current filter.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Time</TableHead>
                      <TableHead className="text-gray-300">Camera</TableHead>
                      <TableHead className="text-gray-300">Event Type</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{event.camera_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                            {event.event_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {event.is_acknowledged ? (
                            <Badge variant="default" className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Profile
                  </CardTitle>
                  <CardDescription className="text-gray-400">Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Username</span>
                    <span className="text-white font-medium">{user?.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Role</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {user?.role?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    System Status
                  </CardTitle>
                  <CardDescription className="text-gray-400">Current system health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Connection</span>
                    <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} 
                           className={connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : ''}>
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Version</span>
                    <span className="text-white font-medium">v1.0.0</span>
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
function App() {
  return (
    <BrowserRouter>
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
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
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