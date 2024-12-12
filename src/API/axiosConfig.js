import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://musify-backend-mzce.onrender.com/api/v1", // Your API base URL
  withCredentials: true, // To send cookies with every request
});

export default axiosInstance;

