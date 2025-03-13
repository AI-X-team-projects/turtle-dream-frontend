import React, { useState } from "react";
import styled from "styled-components";
import CommonTextField from "../../common/CommonTextField";
import CommonRoot from "../../common/CommonRoot";
import CommonButton from "../../common/CommonButton";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import CommonDialog from "../../common/CommonDialog";

const Root = styled(CommonRoot)`
  & input {
    margin-bottom: 10px;
  }
  & button {
    margin-top: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.xxl};
  color: ${(props) => props.theme.color.green};
  font-weight: 800;
  text-align: center;
  margin-bottom: 30px;
`;

const TextStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
  text-align: center;
  margin-top: 30px;
  & span {
    font-weight: 800;
    cursor: pointer;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.color.red};
  font-weight: bold;
  text-align: center;
`;

const MessageStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.color.black};
  text-align: center;
  font-weight: 800;
`;

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false)

  // 상태로 username과 password 변수 선언
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    
    if (!username || !password) {
      setErrorMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setErrorMessage("");

    try {
      const userData = {
        username: username,
        password: password,
      };

      const response = await userApi.login(userData);
      console.log("로그인 응답:", response);

      if (response) {
        // 사용자 정보를 localStorage에 저장
        localStorage.setItem("userId", response.userId || response.id);
        localStorage.setItem("username", response.username);
        // alert("로그인 성공");
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      const errorMessage =
        error.response?.data?.message || "로그인에 실패하였습니다.";
      setErrorMessage(errorMessage);
    }
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate("/main");   
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return (
    <Root>
      <TitleStyle>로그인</TitleStyle>
      <Form onSubmit={handleSubmit}>
        <CommonTextField
          placeholder="아이디"
          width="346px"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <CommonTextField
          type="password"
          placeholder="비밀번호"
          width="346px"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ErrorText>{errorMessage}</ErrorText>
        <CommonButton type="submit" width="346px">
          로그인
        </CommonButton>
      </Form>

      <TextStyle>
        회원이 아닌신가요? <span onClick={goToSignUp}>회원가입</span>
      </TextStyle>

      <CommonDialog
        open={dialogOpen}
        onClick={handleCloseDialog}
        onClose={handleCloseDialog}
      >
        <MessageStyle>로그인 성공</MessageStyle>
      </CommonDialog>
    </Root>
  );
};

export default Login;