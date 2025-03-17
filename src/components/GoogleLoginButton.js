import React from "react";
import styled from "styled-components";
import OAUTH2_ENDPOINTS from "../constants/oauth2";
import { ReactComponent as GoogleIcon } from "../assets/images/google-icon.svg";

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width || "346px"};
  height: 48px;
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }

  &:active {
    background-color: #eee;
  }
`;

const IconWrapper = styled.span`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const GoogleLoginButton = ({ width }) => {
  const handleGoogleLogin = () => {
    // 업데이트된 가이드에 따라 리다이렉트 URI를 지정하지 않는 방식 사용 (권장)
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <GoogleButton width={width} onClick={handleGoogleLogin}>
      <IconWrapper>
        <GoogleIcon width="18" height="18" />
      </IconWrapper>
      Google 계정으로 로그인
    </GoogleButton>
  );
};

export default GoogleLoginButton;
