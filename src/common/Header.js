import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../assets/images/Logo.svg';

const Root = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 5px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #D4D4D4;
`;

const TextStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.base};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
`;

const Header = () => {
    return (
        <Root>
            <Logo/>
            <TextStyle>로그아웃</TextStyle>
        </Root>
    );
};

export default Header;