import React from 'react';
import styled from 'styled-components';
import CommonButton from '../../common/CommonButton';
import CommonTextField from '../../common/CommonTextField';
import CommonRoot from '../../common/CommonRoot';
import { useNavigate } from "react-router-dom";

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const onChange = (e) => {
        const {name, value} = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value
        });
    }
    const goToSignUp = () => {
        navigate("/signup");
    }

    return (
        <Root>
            <TitleStyle>로그인</TitleStyle>
            <CommonTextField
                placeholder={"아이디"}
                width={"346px"}
                onChange={onChange}
            />
            <CommonTextField
                type={"password"}
                placeholder={"비밀번호"}
                width={"346px"}
                onChange={onChange}
            />
            <CommonButton width={"346px"} children={loginForm} />
            <TextStyle>회원이 아닌신가요? <span onClick={goToSignUp}>회원가입</span></TextStyle>
        </Root>
    );
};

export default Login;