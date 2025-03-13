import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../assets/images/Logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi } from "../api/userApi";
import eventBus from "../utils/eventBus";
import CommonDialog from "./CommonDialog";

const Root = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 5px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d4d4d4;
  & svg {
    cursor: pointer;
  }
`;

const ButtonStyle = styled.button`
  background: ${(props) => props.theme.color.white};
  box-sizing: border-box;
  padding: 0px;
  color: ${(props) => props.theme.color.black};
  font-size: ${(props) => props.theme.fontSize.base};
  border: none;
  font-weight: bold;
  cursor: pointer;
`;

const MessageStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.color.black};
  text-align: center;
  font-weight: 800;
`;

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")

  const goToSignIn = async () => {
    try {
      // 카메라 종료 이벤트 발생
      eventBus.publish("STOP_CAMERA");

      // 카메라가 완전히 종료될 시간을 주기 위해 약간 지연
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 로그아웃 요청
      await userApi.logout();

      // 로그아웃 성공 시 로컬 스토리지 정보 삭제
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setDialogOpen(true);
      setDialogMessage("로그아웃 되었습니다.");

    } catch (error) {
      console.error("로그아웃 실패:", error);
      setDialogOpen(true);
      setDialogMessage("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/"); // 로그인 페이지로 이동
  };

  const goToMain = () => {
    navigate("/main");
  };

  // 로그인 페이지나 회원가입 페이지에서는 다이얼로그를 렌더링하지 않음
  if (pathname === "/" || pathname === "/signup") {
    return (
      <Root>
        <Logo onClick={goToMain} />
      </Root>
    );
  }

  return (
    <Root>
      <Logo onClick={goToMain} />
      <ButtonStyle onClick={goToSignIn}>로그아웃</ButtonStyle>
      <CommonDialog
        open={dialogOpen}
        onClick={handleCloseDialog}
        onClose={handleCloseDialog}
        children={<MessageStyle>{dialogMessage}</MessageStyle>}
      />
    </Root>
  );
};

export default Header;
