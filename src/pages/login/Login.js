import React from 'react';
import styled from 'styled-components';
import CommonButton from '../../common/CommonButton';
import CommonTextField from '../../common/CommonTextField';

const Root = styled.div`
    width: 100%;
    min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight})`};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & input {
        margin-bottom: 6px;
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
    return (
        <Root>
            <TitleStyle>로그인</TitleStyle>
            <CommonTextField
                placeholder={"아이디"}
                width={"346px"}
            />
            <CommonTextField
                placeholder={"비밀번호"}
                width={"346px"}
            />
            <CommonButton width={"346px"} children={"로그인"}/>
            <TextStyle>회원이 아닌신가요? <span>회원가입</span></TextStyle>
        </Root>
    );
};

export default Login;