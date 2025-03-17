// OAuth2 관련 엔드포인트
const OAUTH2_ENDPOINTS = {
  // 구글 로그인 시작 URL
  GOOGLE_AUTH_URL: "http://localhost:8080/oauth2/authorize/google",

  // 로그인 사용자 정보 조회 URL
  USER_INFO_URL: "http://localhost:8080/api/oauth2/user",

  // 세션 정보 조회 URL
  SESSION_INFO_URL: "http://localhost:8080/api/oauth2/session",

  // 로그아웃 URL
  LOGOUT_URL: "http://localhost:8080/api/user/logout",
};

export default OAUTH2_ENDPOINTS;
