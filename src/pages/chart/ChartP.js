import React, { useState } from 'react';
import DayChart from './DayChart';
import MonthChart from './MonthChart';

const ChartP = () => {
    const [chartType, setChartType] = useState('day');

    const pageStyle = {
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const buttonContainerStyle = {
        width: '90vw',
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '20px'
    };

    const buttonStyle = (isActive) => ({
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: isActive ? '600' : '400',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: isActive ? '#000' : '#666',
        borderBottom: isActive ? '2px solid #000' : 'none',
        marginBottom: isActive ? '-1px' : '0',
        transition: 'all 0.2s ease'
    });

    return (
        <div style={pageStyle}>
            <div style={buttonContainerStyle}>
                <button 
                    style={buttonStyle(chartType === 'day')}
                    onClick={() => setChartType('day')}
                >
                    일일 분석
                </button>
                <button 
                    style={buttonStyle(chartType === 'month')}
                    onClick={() => setChartType('month')}
                >
                    월별 분석
                </button>
            </div>
            {chartType === 'day' ? <DayChart /> : <MonthChart />}
        </div>
    );
};

export default ChartP;