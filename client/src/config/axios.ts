import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/" : "",
    withCredentials: true,
});

export default api;