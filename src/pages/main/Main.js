import React from 'react';
import styled from 'styled-components';
import CommonRoot from '../../common/CommonRoot';
import { ReactComponent as TurtleImage } from '../../assets/images/TurtleImage.svg';
import CommonButton from '../../common/CommonButton';
import { useNavigate } from "react-router-dom";

const TitleStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.lg};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
    text-align: center;
    margin-bottom: 10px;
    letter-spacing: -2px;
`;

const TextStyle = styled(TitleStyle)`
    font-size: ${(props) => props.theme.fontSize.md};
    font-weight: 500;
    letter-spacing: normal;
    line-height: 25px;
    margin-bottom: 43px;;
`;

const Box = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Main = () => {
    const navigate = useNavigate();
    
    const goToAnalysis = () => {
        navigate("/analysis");
    }

    const goToChart = () => {
        navigate("/ChartP");
    }
    
    const ButtonProps = {
        width: '290px',
    };

    return (
        <CommonRoot>
            <TurtleImage/>
            <TitleStyle>"하루 종일 앉아 있는 당신, 자세는 괜찮으신가요?"</TitleStyle>
            <TextStyle>
            AI가 실시간으로 당신의 자세를 분석하고, <br/>
            올바른 자세를 유지할 수 있도록 도와드립니다.<br/>
            지금 바로 건강한 습관을 시작하세요!
            </TextStyle>
            <Box>
                <CommonButton 
                    children={"/ws/posture"}
                    onClick={goToAnalysis}
                    {...ButtonProps}
                />
                <CommonButton 
                    children={"자세분석"}
                    onClick={goToChart}
                    {...ButtonProps}
                />
            </Box>
        </CommonRoot>
    );
};

export default Main;