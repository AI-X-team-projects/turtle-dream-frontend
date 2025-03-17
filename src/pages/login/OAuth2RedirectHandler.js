import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import OAUTH2_ENDPOINTS from "../../constants/oauth2";
import CommonRoot from "../../common/CommonRoot";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoadingText = styled.p`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.color.green};
  margin-bottom: 20px;
`;

const ErrorText = styled.p`
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.color.red};
  margin-top: 20px;
  text-align: center;
`;

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("OAuth2RedirectHandler - 현재 URL:", window.location.href);
    console.log(
      "OAuth2RedirectHandler - 쿼리 파라미터:",
      Object.fromEntries([...searchParams])
    );

    // URL에서 파라미터 추출
    const login = searchParams.get("login");
    const userId = searchParams.get("userId");

    if (login === "success" && userId) {
      // 로그인 성공 시 사용자 정보 저장
      localStorage.setItem("userId", userId);

      // 사용자 정보 API 호출
      fetchUserInfo();
    } else {
      // 파라미터가 없는 경우에도 사용자 정보 API 호출 시도
      // 세션 기반 인증이므로 쿠키가 있으면 사용자 정보를 가져올 수 있음
      fetchUserInfo();
    }
  }, [navigate, location, searchParams]);

  // 사용자 정보 조회 함수
  const fetchUserInfo = async () => {
    try {
      console.log("사용자 정보 조회 API 호출");

      // 세션 기반 인증이므로 쿠키가 자동으로 전송됨
      const response = await axios.get(OAUTH2_ENDPOINTS.USER_INFO_URL, {
        withCredentials: true,
      });

      console.log("사용자 정보 응답:", response.data);

      if (response.data && response.data.authenticated) {
        // 사용자 정보 저장
        localStorage.setItem(
          "userId",
          response.data.id ||
            response.data.userId ||
            searchParams.get("userId") ||
            "oauth-user"
        );
        localStorage.setItem(
          "username",
          response.data.name || response.data.email || "사용자"
        );

        // 메인 페이지로 리다이렉트
        navigate("/main");
      } else if (response.data) {
        // authenticated 필드가 없지만 데이터가 있는 경우
        localStorage.setItem(
          "userId",
          response.data.id ||
            response.data.userId ||
            searchParams.get("userId") ||
            "oauth-user"
        );
        localStorage.setItem(
          "username",
          response.data.name || response.data.email || "사용자"
        );

        // 메인 페이지로 리다이렉트
        navigate("/main");
      } else {
        setError("사용자 정보를 가져오는데 실패했습니다.");
        setLoading(false);

        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error("사용자 정보 조회 중 오류:", err);

      // URL에서 userId 파라미터가 있으면 그것을 사용
      const userId = searchParams.get("userId");
      if (userId) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", "구글 사용자");
        navigate("/main");
        return;
      }

      // 오류 메시지 표시
      setError("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);

      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <CommonRoot>
      <LoadingContainer>
        {loading ? (
          <LoadingText>로그인 처리 중...</LoadingText>
        ) : (
          <LoadingText>로그인 처리 완료</LoadingText>
        )}
        {error && <ErrorText>{error}</ErrorText>}
      </LoadingContainer>
    </CommonRoot>
  );
};

export default OAuth2RedirectHandler;
