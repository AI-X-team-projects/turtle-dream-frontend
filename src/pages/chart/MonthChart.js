import { ResponsiveBar } from '@nivo/bar';

const MonthChart = () => {
    const pageStyle = {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
    };

    const containerStyle = {
        width: '90vw',
        height: '75vh'
    };

    const textBoxStyle = {
        width: '90vw',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const textBoxTitleStyle = {
        marginBottom: '10px'
    };

    // 월별 데이터
    const data = [
        { month: '1월', '나쁜 자세': 120 },
        { month: '2월', '나쁜 자세': 98 },
        { month: '3월', '나쁜 자세': 87 },
        { month: '4월', '나쁜 자세': 145 },
        { month: '5월', '나쁜 자세': 78 },
        { month: '6월', '나쁜 자세': 92 },
        { month: '7월', '나쁜 자세': 68 },
        { month: '8월', '나쁜 자세': 88 },
        { month: '9월', '나쁜 자세': 105 },
        { month: '10월', '나쁜 자세': 85 },
        { month: '11월', '나쁜 자세': 115 },
        { month: '12월', '나쁜 자세': 95 }
    ];

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <ResponsiveBar
                    data={data}
                    keys={['나쁜 자세']}
                    indexBy="month"
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={['#FFB6C1']}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: '월',
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '나쁜 자세 횟수',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    role="application"
                    ariaLabel="월별 나쁜 자세 분석"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue}회`}
                />
            </div>
            <div style={textBoxStyle}>
                <div style={textBoxTitleStyle}>
                    <h2>월별 나쁜 자세 분석</h2>
                    <p>월별 나쁜 자세 발생 횟수를 확인해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</p>
                </div>
            </div>
        </div>
    );
};

export default MonthChart; 