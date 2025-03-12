import React from "react";
import styled from 'styled-components';

const InputStyle = styled.input`
  width: ${(props) => (props.width ||  '100%')};
  height: ${(props) => (props.height ||  '50px')};
  background-color: #fff;
  border: 1px solid #DADADA;
  border-radius: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontSize.base};

  &::placeholder {
    color: rgba(24,24,29.0.4);
    font-weight: 800;
  }
  &:focus {
    outline: none;
  }
`;

const CommonTextField = ({
    type = "text",
    width,
    placeholder,
    value,
    onChange,
    disabled
}) => {
  return (
    <InputStyle 
        type={type}
        width={width}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
    />
  );
};

export default CommonTextField;