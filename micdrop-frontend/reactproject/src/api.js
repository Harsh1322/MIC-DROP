// src/API.js
import axios from 'axios';

const API_BASE_URL = 'https://mic-drop-030c.onrender.com';
// || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example of a request interceptor to add authorization token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Example of a response interceptor for error handling
apiClient.interceptors.response.use(response => response, error => {
  // Handle error
  console.error('API error occurred:', error);
  return Promise.reject(error);
});

export default apiClient;
export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);
export const startContest = (data) => API.post("/start-contest", data);
export const addParticipant = (data) => API.post("/add-participant", data);
export const submitVote = (data) => API.post("/submit-vote", data);
export const getApiUrl = (endpoint) => `${API}${endpoint}`;
