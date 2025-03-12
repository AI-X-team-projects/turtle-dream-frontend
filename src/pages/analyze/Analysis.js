import React, {useState} from 'react';
import styled from 'styled-components';
import CommonRoot from '../../common/CommonRoot';
import { ReactComponent as VideoImage } from '../../assets/images/VideoImage.svg';
import { ReactComponent as ArrowIcon } from '../../assets/images/ArrowIcon.svg';
import CommonButton from '../../common/CommonButton';

const TitleStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.lg};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
    text-align: center;
    margin-bottom: 24px;
`;

const VideoBoxStyle = styled.div`
    width: 500px;
    height: 281px;
    border-radius: 8px;
    border: 1px dashed #D4D4D4;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
    box-sizing: border-box;
`;

const DropdownContainer = styled.div`
  width: 500px;
  position: relative;
  margin-bottom: 20px;
`;

const SelectBox = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.color.grey};
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
`;

const OptionsList = styled.ul.attrs(() => ({ role: "list" }))`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
  background: ${(props) => props.theme.color.white};
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const OptionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const Analysis = () => {
    const [start, setStart] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Facetime HD Camera (Built-in)");

    const cameras = [
        "Facetime HD Camera (Built-in)",
        "External Webcam",
        "Virtual Camera"
    ];

    const handleSelect = (camera) => {
        setSelected(camera);
        setIsOpen(false);
    };
  
    const handleClickButton = () => {
        setStart(!start);
    }

    return (
        <CommonRoot>
            <TitleStyle>자세 측정</TitleStyle>
            <VideoBoxStyle>
                <VideoImage/>
            </VideoBoxStyle>
            <DropdownContainer>
                <SelectBox onClick={() => setIsOpen(!isOpen)}>
                    {selected} <span><ArrowIcon/></span>
                </SelectBox>
                <OptionsList $isOpen={isOpen}>
                    {cameras.map((camera, index) => (
                    <OptionItem key={index} onClick={() => handleSelect(camera)}>
                        {camera}
                    </OptionItem>
                    ))}
                </OptionsList>
            </DropdownContainer>
            <CommonButton 
                background={start ? true : false} 
                width={"500px"} 
                children={start ? "측정 중지" : "측정 시작"} 
                onClick={handleClickButton}
            />
        </CommonRoot>
    );
};

export default Analysis;