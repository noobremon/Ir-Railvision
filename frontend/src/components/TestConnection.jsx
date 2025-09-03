import React, { useState, useEffect } from 'react';
import { testMongoDB } from '../lib/api';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testMongoDB();
        setConnectionStatus(`✅ ${result.message}`);
        if (result.collections) {
          setCollections(result.collections);
        }
      } catch (error) {
        setConnectionStatus('❌ Failed to connect to backend. Make sure the server is running.');
        console.error('Connection error:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">MongoDB Connection Test</h2>
      <p className="mb-4">{connectionStatus}</p>
      
      {collections.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Available Collections:</h3>
          <ul className="list-disc pl-5">
            {collections.map((collection, index) => (
              <li key={index} className="text-sm">{collection}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
