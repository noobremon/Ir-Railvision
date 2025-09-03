import React, { useState, useEffect } from 'react';
import { testMongoDB } from '../lib/api';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
  const [systemInfo, setSystemInfo] = useState({});

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testMongoDB();
        setConnectionStatus(`✅ ${result.message}`);
        if (result.active_cameras !== undefined) {
          setSystemInfo({
            activeCameras: result.active_cameras,
            connectedClients: result.connected_clients,
            system: result.system
          });
        }
      } catch (error) {
        setConnectionStatus('❌ Failed to connect to backend. Make sure the FastAPI server is running on port 8000.');
        console.error('Connection error:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      <p className="mb-4">{connectionStatus}</p>
      
      {Object.keys(systemInfo).length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">System Information:</h3>
          <ul className="list-disc pl-5">
            <li className="text-sm">Active Cameras: {systemInfo.activeCameras}</li>
            <li className="text-sm">Connected Clients: {systemInfo.connectedClients}</li>
            <li className="text-sm">System: {systemInfo.system}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
