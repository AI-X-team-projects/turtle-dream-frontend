import axios from "./axios";

export const userApi = {
  // 회원가입
  register: async (userData) => {
    try {
      const response = await axios.post("/api/user/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 로그인
  login: async (userData) => {
    try {
      const response = await axios.post("/api/user/login", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const response = await axios.post("/api/user/logout");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      return true;
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      throw error;
    }
  },

  // 사용자명 중복 체크
  checkUsername: async (username) => {
    try {
      const response = await axios.get(`/api/user/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 로그인 상태 확인
  checkLoginStatus: () => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    return !!(userId && username); // userId와 username이 모두 있으면 true, 하나라도 없으면 false
  }
};