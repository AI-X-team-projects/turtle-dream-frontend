import React, { forwardRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";

const ButtonStyle = styled.button`
  width: ${(props) => props.width || "50px"};
  height: ${(props) => props.height || "55px"};
  background: ${(props) => (props.$outline ? props.theme.color.white : props.$background ? props.theme.color.red : props.theme.color.green)};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${(props) => (props.$outline ? props.theme.color.green : props.theme.color.white)};
  border: ${(props) => (props.$outline ? `2px solid ${props.theme.color.green}` : "none")};
  font-size: ${(props) => props.fontSize || props.theme.fontSize.md};
  font-weight: bold;
  cursor: pointer;
`;

const CommonButton = forwardRef(({
  children,
  fontSize,
  width,
  height,
  outline = false,
  onClick,
  background,
  onKeyDown
}, ref) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      if (onClick) {
        onClick();
      } else {
        await instance.post(`/api/user/${children}`);
        navigate("/main");
      }
    } catch (error) {
      console.error('버튼 클릭 오류:', error);
    }
  };

  return (
    <ButtonStyle
      ref={ref} // forwardRef 적용
      width={width}
      height={height}
      $outline={outline}
      fontSize={fontSize}
      $background={background}
      onClick={handleClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </ButtonStyle >
  );
});

export default CommonButton;
