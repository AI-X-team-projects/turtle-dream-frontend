import React, { useState } from 'react';
import styled from 'styled-components';
import DayChart from './DayChart';
import MonthChart from './MonthChart';

const Root = styled.div`
    width: 800px;
    min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight})`};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TitleStyle = styled.p`
    margin: 0;
    font-size: ${(props) => props.theme.fontSize.lg};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
    text-align: center;
    margin-bottom: 24px;
    margin-top: 20px;
`;

const Box = styled.div`
    width: 100%;
`;

const ButtonStyle = styled.button`
    padding: 12px 24px;
    font-size: ${(props) => props.theme.fontSize.sm};
    font-weight: ${(props) => (props.$isActive ? 800 : 400)};
    border: none;
    cursor: pointer;
    background: transparent;
    color: ${(props) => (props.$isActive ? props.theme.color.green : '#666')};
    border-bottom: ${(props) => (props.$isActive ? `2px solid ${props.theme.color.green}` : 'none')};
    transition: all 0.2s ease;
`;

const ChartP = () => {
    const [chartType, setChartType] = useState('day');

    return (
        <Root>
            <TitleStyle>자세 분석</TitleStyle>
            <Box>
                <ButtonStyle 
                    $isActive={chartType === 'day'}
                    onClick={() => setChartType('day')}
                >
                    일일 분석
                </ButtonStyle >
                <ButtonStyle  
                    $isActive={chartType === 'month'}
                    onClick={() => setChartType('month')}
                >
                    월별 분석
                </ButtonStyle >
            </Box>
            {chartType === 'day' ? <DayChart /> : <MonthChart />}
        </Root>
    );
};

export default ChartP;