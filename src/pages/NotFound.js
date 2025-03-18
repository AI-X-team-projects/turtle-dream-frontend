import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.color.primary};
    margin-bottom: 16px;
`;

const Text = styled.p`
    font-size: 18px;
    color: ${(props) => props.theme.color.gray};
`;

const BackButton = styled(Link)`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: ${(props) => props.theme.color.primary};
    border-radius: 5px;
    text-decoration: none;
    background-color: ${(props) => props.theme.color.green};
`;

const NotFound = () => {
    return (
        <Container>
            <Title>404</Title>
            <Text>페이지를 찾을 수 없습니다.</Text>
            <BackButton to="/">메인으로 돌아가기</BackButton>
        </Container>
    );
};

export default NotFound;
