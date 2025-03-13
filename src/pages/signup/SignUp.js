import React, { useState } from "react";
import styled from "styled-components";
import CommonRoot from "../../common/CommonRoot";
import CommonTextField from "../../common/CommonTextField";
import CommonButton from "../../common/CommonButton";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 사용

const Root = styled(CommonRoot)`
  & > input {
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

const Box = styled.div`
  width: 346px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TextStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.color.red};
  font-weight: bold;
  text-align: center;
`;

const SignUp = () => {
  const navigate = useNavigate(); // navigate 훅 사용
  const [gender, setGender] = useState("남"); // 성별 선택
  const [username, setUsername] = useState(""); // 아이디 입력
  const [password, setPassword] = useState(""); // 비밀번호 입력
  const [passwordCheck, SetPasswordCheck] = useState(""); // 비밀번호 확인 입력
  const [name, setName] = useState(""); // 이름 입력
  const [userNameAvailable, setUserNameAvailable] = useState(""); // 아이디 중복 확인
  const [age, setAge] = useState(""); // 나이 입력
  const [height, setHeight] = useState(""); // 키 입력

  // 회원가입 요청
  const handleSignUp = async () => {
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const userData = { username, password, name, gender, age, height }; // 파라미터 객체로 묶기
      const response = await userApi.register(userData);
      alert("회원가입이 완료되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    } catch (error) {
      alert("회원 가입에 실패 하셨습니다.");
      console.error("회원가입 실패", error);
    }
  };

  // 아이디 중복 확인 함수
  const handleCheckUserName = async () => {
    try {
      const response = await userApi.checkUsername(username);
      if (response.isAvailable) {
        setUserNameAvailable(true);
        alert("사용 가능한 아이디입니다.");
      } else {
        setUserNameAvailable(false);
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 실패", error);
    }
  };

  const InputProps = {
    width: "346px",
  };

  const ButtonProps = {
    width: "50px",
    height: "50px",
    fontSize: "16px", // ; 제거
  };

  return (
    <Root>
      <TitleStyle>회원가입</TitleStyle>
      <Box>
        <CommonTextField
          placeholder={"아이디"}
          width={"245px"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <CommonButton
          width={"90px"}
          height={"50px"}
          fontSize={"16px"}
          onClick={handleCheckUserName} // 아이디 중복 확인
        >
          중복 확인
        </CommonButton>
      </Box>

      {/* 비밀번호 입력 */}
      <CommonTextField
        type={"password"}
        placeholder={"비밀번호"}
        width={"346px"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <CommonTextField
        type={"password"}
        placeholder={"비밀번호 확인"}
        width={"346px"}
        value={passwordCheck}
        onChange={(e) => SetPasswordCheck(e.target.value)}
      />

      {/* 이름과 성별 선택 */}
      <Box>
        <CommonTextField
          placeholder={"이름"}
          width={"228px"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <CommonButton
          outline={gender === "남" ? false : true}
          onClick={() => setGender("남")} // 성별 남 선택
        >
          남
        </CommonButton>
        <CommonButton
          outline={gender === "여" ? false : true}
          onClick={() => setGender("여")} // 성별 여 선택
          {...ButtonProps}
        >
          여
        </CommonButton>
      </Box>

      <Box>
        <CommonTextField
          placeholder={"나이"}
          width={"168px"}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <CommonTextField
          placeholder={"키"}
          width={"168px"}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </Box>

      {/* 아이디 중복 메시지 */}
      <TextStyle>{!userNameAvailable && "중복된 아이디가 있습니다."}</TextStyle>

      {/* 회원가입 버튼 */}
      <CommonButton width="346px" onClick={handleSignUp}>
        회원가입
      </CommonButton>
    </Root>
  );
};

export default SignUp;
