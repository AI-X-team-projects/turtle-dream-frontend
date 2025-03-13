import React, { useState } from "react";
import styled from "styled-components";
import CommonRoot from "../../common/CommonRoot";
import CommonTextField from "../../common/CommonTextField";
import CommonButton from "../../common/CommonButton";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [gender, setGender] = useState("남");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [userNameAvailable, setUserNameAvailable] = useState(null);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "아이디를 입력해주세요.";
      alert("아이디를 입력해주세요.");
      return false;
    }
    if (!userNameAvailable) {
      newErrors.username = "아이디 중복 확인이 필요합니다.";
      alert("아이디 중복 확인이 필요합니다.");
      return false;
    }
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      alert("비밀번호를 입력해주세요.");
      return false;
    }
    if (password !== passwordCheck) {
      newErrors.passwordCheck = "비밀번호가 일치하지 않습니다.";
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (!name) {
      newErrors.name = "이름을 입력해주세요.";
      alert("이름을 입력해주세요.");
      return false;
    }
    if (!age) {
      newErrors.age = "나이를 입력해주세요.";
      alert("나이를 입력해주세요.");
      return false;
    }
    if (!height) {
      newErrors.height = "키를 입력해주세요.";
      alert("키를 입력해주세요.");
      return false;
    }

    // 숫자 필드 검증
    if (age && (isNaN(age) || age < 1)) {
      newErrors.age = "올바른 나이를 입력해주세요.";
      alert("올바른 나이를 입력해주세요.");
      return false;
    }
    if (height && (isNaN(height) || height < 1)) {
      newErrors.height = "올바른 키를 입력해주세요.";
      alert("올바른 키를 입력해주세요.");
      return false;
    }

    setErrors(newErrors);
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username,
        password,
        name,
        gender,
        age: parseInt(age),
        height: parseFloat(height),
      };
      const response = await userApi.register(userData);
      console.log("회원가입 응답:", response); // 디버깅용 로그 추가

      // response는 이미 response.data의 내용을 가지고 있음
      if (response) {
        // 사용자 정보 저장
        localStorage.setItem("userId", response.userId || response.id);
        localStorage.setItem("username", response.username);
        alert("회원가입이 완료되었습니다.");
        navigate("/");
      } else {
        throw new Error("서버 응답 데이터가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("회원가입 실패", error);
      const errorMessage =
        error.response?.data?.message || "회원 가입에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckUserName = async () => {
    if (!username) {
      setErrors((prev) => ({ ...prev, username: "아이디를 입력해주세요." }));
      return;
    }

    setIsLoading(true);
    try {
      const isAvailable = await userApi.checkUsername(username);
      console.log("아이디 중복 확인 응답:", isAvailable); // 디버깅용 로그
      setUserNameAvailable(isAvailable);

      if (isAvailable) {
        setErrors((prev) => ({ ...prev, username: null }));
        alert("사용 가능한 아이디입니다.");
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용 중인 아이디입니다.",
        }));
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 실패", error);
      setUserNameAvailable(false);
      setErrors((prev) => ({
        ...prev,
        username:
          error.response?.data?.message || "아이디 중복 확인에 실패했습니다.",
      }));
      alert("아이디 중복 확인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUserNameAvailable(null);
    setErrors((prev) => ({ ...prev, username: null }));
  };

  const InputProps = {
    width: "346px",
  };

  const ButtonProps = {
    width: "50px",
    height: "50px",
    fontSize: "16px",
  };

  return (
    <Root>
      <TitleStyle>회원가입</TitleStyle>
      <Box>
        <CommonTextField
          placeholder={"아이디"}
          width={"245px"}
          value={username}
          onChange={handleUsernameChange}
          error={errors.username}
        />
        <CommonButton
          width={"90px"}
          height={"50px"}
          fontSize={"16px"}
          onClick={handleCheckUserName}
          disabled={!username || isLoading}
        >
          중복 확인
        </CommonButton>
      </Box>

      <CommonTextField
        type={"password"}
        placeholder={"비밀번호"}
        width={"346px"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <CommonTextField
        type={"password"}
        placeholder={"비밀번호 확인"}
        width={"346px"}
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        error={errors.passwordCheck}
      />

      <Box>
        <CommonTextField
          placeholder={"이름"}
          width={"228px"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <CommonButton
          outline={gender === "남" ? false : true}
          onClick={() => setGender("남")} // 성별 남 선택
          {...ButtonProps}
        >
          남
        </CommonButton>
        <CommonButton
          outline={gender === "여" ? false : true}
          onClick={() => setGender("여")}
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
          type="number"
          error={errors.age}
        />
        <CommonTextField
          placeholder={"키"}
          width={"168px"}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          type="number"
          step="0.1"
          error={errors.height}
        />
      </Box>

      <TextStyle>{!userNameAvailable && "중복된 아이디가 있습니다."}</TextStyle>

      <CommonButton
        width="346px"
        onClick={handleSignUp}
        disabled={!userNameAvailable}
      >
        회원가입
      </CommonButton>
    </Root>
  );
};

export default SignUp;
