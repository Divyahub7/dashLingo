import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const sendQuery = async (prompt, sessionId, conversation = []) => {
  const response = await api.post("/api/query", {
    prompt,
    sessionId,
    conversation,
  });
  return response.data;
};

export const getHistory = async (sessionId) => {
  const response = await api.get(`/api/history/${sessionId}`);
  return response.data;
};

export default api;
