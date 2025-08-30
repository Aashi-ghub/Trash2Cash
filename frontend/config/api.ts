// API Configuration
export const API_CONFIG = {
  // For local development
  LOCAL: 'http://localhost:3001',
  
  // For deployed backend
  DEPLOYED: 'https://eco-hive-network.onrender.com',
  
  // Current active backend (change this to switch)
  CURRENT: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
};

export const getApiBaseUrl = () => {
  return API_CONFIG.CURRENT;
};
