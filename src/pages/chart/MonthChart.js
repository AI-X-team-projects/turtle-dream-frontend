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
        border: '1px solid #ccc',
        width: '90vw',
        padding: '20px',
        backgroundColor: '#E7ECE9', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const h2 ={
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#3B604B'
    }
    const p = { 
        fontSize: '16px',
        color: '#303030'
    }

    const textBoxTitleStyle = {
        marginBottom: '10px'
    };

    // 월별 데이터 (좋은 자세와 나쁜 자세를 하나의 객체로 통합)
    const data = [
        { month: '1월', '좋은 자세': 120, '나쁜 자세': 80 },
        { month: '2월', '좋은 자세': 198, '나쁜 자세': 98 },
        { month: '3월', '좋은 자세': 87, '나쁜 자세': 107 },
        { month: '4월', '좋은 자세': 145, '나쁜 자세': 205 }
    ];

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <ResponsiveBar
                    data={data}
                    keys={['좋은 자세', '나쁜 자세']}
                    indexBy="month"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={['#90EE90', '#FFB6C1']} // 좋은 자세는 연한 초록색, 나쁜 자세는 연한 빨간색
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                 
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 20
                        }
                    ]}
                    role="application"
                    ariaLabel="월별 자세 분석"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue}회`}
                />
            </div>
            <div style={textBoxStyle}>
                <div style={textBoxTitleStyle}>
                    <h2 style={h2}>월별 자세 분석</h2>
                    <p style={p}>월별 좋은 자세와 나쁜 자세의 발생 횟수를 비교해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</p>
                </div>
            </div>
        </div>
    );
};

export default MonthChart; 