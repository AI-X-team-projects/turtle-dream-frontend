import axios from "./axios";

export const userApi = {
  // 회원가입
  register: async (userData) => {
    try {
      const response = await axios.post("/api/user/register", userData);
      return response.data;
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      throw error;
    }
  },

  // 로그인
  login: async (userData) => {
    try {
      console.log("로그인 시도:", userData);
      const response = await axios.post("/api/user/login", userData);
      console.log("로그인 응답:", response);
      
      if (response.data) {
        const userId = response.data.id || response.data.Id || response.data.userId;
        const username = response.data.username;
        
        if (userId && username) {
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", username);
          return response.data;
        } else {
          throw new Error("서버 응답에 필요한 사용자 정보가 없습니다.");
        }
      }
      throw new Error("서버 응답이 올바르지 않습니다.");
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
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
      console.error("로그아웃 요청 중 오류 발생:", error.response?.data || error.message);
      throw error;
    }
  },

  // 사용자명 중복 체크
  checkUsername: async (username) => {
    try {
      const response = await axios.get(`/api/user/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      console.error("사용자명 중복 체크 실패:", error.response?.data || error.message);
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