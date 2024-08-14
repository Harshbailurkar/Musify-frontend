import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Your API base URL
  withCredentials: true, // To send cookies with every request
});

export default axiosInstance;
//http://localhost:8000
//https://musify-backend-mzce.onrender.com
//https://musify-backend-1.onrender.com
