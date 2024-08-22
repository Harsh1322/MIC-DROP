import axios from 'axios';

const API = axios.create({ baseURL: "https://mic-drop-030c.onrender.com" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);
export const startContest = (data) => API.post("/start-contest", data);
export const addParticipant = (data) => API.post("/add-participant", data);
export const submitVote = (data) => API.post("/submit-vote", data);
export const getApiUrl = (endpoint) => `${API}${endpoint}`;
