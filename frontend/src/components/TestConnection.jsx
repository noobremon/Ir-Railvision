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
    <div className="p-8 max-w-lg mx-auto mt-12 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">MongoDB Connection Test</h2>
      <p className="mb-6 text-lg">{connectionStatus}</p>
      
      {collections.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4 text-lg">Available Collections:</h3>
          <ul className="list-disc pl-6 space-y-2">
            {collections.map((collection, index) => (
              <li key={index} className="text-base">{collection}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
