import React, { useState } from "react";
import styled from "styled-components";
import CommonTextField from "../../common/CommonTextField";
import CommonRoot from "../../common/CommonRoot";
import CommonButton from "../../common/CommonButton";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";

const Root = styled(CommonRoot)`
  & input {
    margin-bottom: 10px;
  }
  & button {
    margin-top: 14px;
  }
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //회원 가입 페이지로 이동
  const goToSignUp = () => {
    navigate("/signup");
  };

  // 로그인 요청
  const handleLogin = async () => {
    try {
      const response = await userApi.login(username, password);
      alert("로그인 성공");
      console.log("/main"); //로그인 성공후 메인페이지로
    } catch (error) {
      alert("로그인이 실패하셨습니다. 아이디와 비밀번호를 확인해주세요.");
      console.error("로그인 실패", error);
    }
  };

  return (
    <Root>
      <TitleStyle>로그인</TitleStyle>
      <CommonTextField
        placeholder={"아이디"}
        width={"346px"}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <CommonTextField
        type={"password"}
        placeholder={"비밀번호"}
        width={"346px"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <CommonButton width={"346px"} onClick={handleLogin}>
        로그인
      </CommonButton>
      <TextStyle>
        회원이 아닌신가요? <span onClick={goToSignUp}>회원가입</span>
      </TextStyle>
    </Root>
  );
};

export default Login;
