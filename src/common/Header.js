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

const ButtonStyle = styled.button`
  background: ${(props) => (props.theme.color.white)};
  box-sizing: border-box;
  padding: 0px;
  color: ${(props) => props.theme.color.black};
  font-size: ${(props) => props.theme.fontSize.base};
  border: none;
  font-weight: bold;
  cursor: pointer;
`;

const Header = () => {
    return (
        <Root>
            <Logo/>
            <ButtonStyle>로그아웃</ButtonStyle>
        </Root>
    );
};

export default Header;