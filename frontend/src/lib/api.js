import axios from 'axios';

// Use relative URL to leverage Vite proxy in development
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Test backend connection
export const testMongoDB = async () => {
  try {
    const response = await api.get('/health');
    return {
      status: 'success',
      message: 'Successfully connected to Railway Video Surveillance System!',
      ...response.data
    };
  } catch (error) {
    console.error('Error testing backend connection:', error);
    throw error;
  }
};

// Add more API calls here as needed

export default api;
