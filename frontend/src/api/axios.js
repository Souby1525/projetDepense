import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      localStorage.setItem("token", token);
    } catch (e) {
      // ignore
    }
  } else {
    delete api.defaults.headers.common["Authorization"];
    try {
      localStorage.removeItem("token");
    } catch (e) {
      // ignore
    }
  }
};

export default api;
