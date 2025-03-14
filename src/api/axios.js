import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    console.log("API 요청:", config);
    return config;
  },
  (error) => {
    console.error("API 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    console.log("API 응답:", response);
    return response;
  },
  (error) => {
    console.error("API 응답 에러:", error.response || error);
    return Promise.reject(error);
  }
);

export default instance;
