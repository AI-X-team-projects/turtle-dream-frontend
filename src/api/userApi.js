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

  // 사용자명 중복 체크
  checkUsername: async (username) => {
    try {
      const response = await axios.get(
        `/api/user/check-username?username=${username}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
