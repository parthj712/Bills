import axios from "axios";

const API = axios.create({
  baseURL: "https://billing-web-app-coral.vercel.app/api",
  withCredentials: true,
});

export default API;
