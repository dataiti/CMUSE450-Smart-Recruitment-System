import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_PROVINCE_API_URL,
  headers: {
    accept: "application/json",
  },
});

export default axiosClient;
