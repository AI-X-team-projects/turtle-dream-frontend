import React from "react";
import styled from "styled-components";

const ButtonStyle = styled.button`
  width: ${(props) => props.width || "50px"};
  height: ${(props) => props.height || "55px"};
  background: ${(props) => (props.$outline ? props.theme.color.white : props.theme.color.green)};
  box-sizing: border-box;
  border-radius: 8px;
  color: ${(props) => (props.$outline ? props.theme.color.green : props.theme.color.white)};
  border: ${(props) => (props.$outline ? `2px solid ${props.theme.color.green}` : "none")};
  font-size: ${(props) => props.fontSize || props.theme.fontSize.md};
  font-weight: bold;
  cursor: pointer;
`;

const CommonButton = ({
  children,
  fontSize,
  width,
  height,
  outline = false, 
  onClick,
}) => {
  return (
    <ButtonStyle
      width={width}
      height={height}
      $outline={outline}
      fontSize={fontSize}
      onClick={onClick}
    >
      {children}
    </ButtonStyle>
  );
};

export default CommonButton;
