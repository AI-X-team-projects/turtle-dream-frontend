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

  // 상태로 username과 password 변수 선언
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 회원 가입 페이지로 이동
  const goToSignUp = () => {
    navigate("/signup");
  };

  // 로그인 요청
  const handleLogin = async () => {
    if (!username || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

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
        alert("로그인 성공");
        navigate("/main"); // 메인 페이지로 이동
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      const errorMessage =
        error.response?.data?.message || "로그인에 실패하였습니다.";
      alert(errorMessage);
    }
  };

  return (
    <Root>
      <TitleStyle>로그인</TitleStyle>

      {/* 사용자명 입력 */}
      <CommonTextField
        placeholder={"아이디"}
        width={"346px"}
        value={username} // 상태에 있는 username을 연결
        onChange={(e) => setUsername(e.target.value)} // 상태 업데이트
      />

      {/* 비밀번호 입력 */}
      <CommonTextField
        type={"password"}
        placeholder={"비밀번호"}
        width={"346px"}
        value={password} // 상태에 있는 password를 연결
        onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
      />

      {/* 로그인 버튼 */}
      <CommonButton width={"346px"} onClick={handleLogin}>
        로그인
      </CommonButton>

      {/* 회원가입 링크 */}
      <TextStyle>
        회원이 아닌신가요? <span onClick={goToSignUp}>회원가입</span>
      </TextStyle>
    </Root>
  );
};

export default Login;
