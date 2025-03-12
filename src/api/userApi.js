import axios from "./axios";

export const userApi = {
  // 회원가입
  register: async (userData) => {
    try {
      const response = await axios.post("/api/user/register", userData);
      return response.data;
    } catch (error) {
      // 더 구체적인 에러 메시지 처리 가능
      throw new Error(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    }
  },

  // 로그인
  login: async (data) => {
    // { username, password } 객체를 받는 방식으로 수정
    try {
      const response = await axios.post("/api/user/login", null, {
        params: data, // { username, password } 객체를 그대로 전달
      });
      return response.data;
    } catch (error) {
      // 에러 메시지 처리
      throw new Error(
        error.response?.data?.message || "로그인 중 오류가 발생했습니다."
      );
    }
  },

  // 사용자명 중복 체크
  checkUsername: async (username) => {
    try {
      const response = await axios.get("/api/user/check-username", {
        params: { username },
      });
      return response.data;
    } catch (error) {
      // 에러 메시지 처리
      throw new Error(
        error.response?.data?.message ||
          "아이디 중복 체크 중 오류가 발생했습니다."
      );
    }
  },
};
