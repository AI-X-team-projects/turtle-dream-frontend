import { ResponsiveLine } from '@nivo/line';

const DayChart = () => {
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

    // 5분 간격의 데이터 생성 (09:00부터 18:00까지)
    const generateTimeData = () => {
        const data = [];
        const startHour = 9;
        const endHour = 18;
        
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                // 랜덤한 나쁜 자세 횟수 (0~18 사이)
                const badPostureCount = Math.floor(Math.random() * 19);
                data.push({
                    x: time,
                    y: badPostureCount
                });
            }
        }
        return data;
    };

    const transformedData = [
        {
            id: "나쁜 자세 횟수",
            color: "#90EE90",
            data: generateTimeData()
        }
    ];

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <ResponsiveLine
                    data={transformedData}
                    margin={{ top: 50, right: 110, bottom: 70, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 0,
                        max: 18,
                        stacked: false,
                        reverse: false
                    }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickValues: transformedData[0].data
                            .filter((_, index) => index % 2 === 0) // 1시간 간격으로 표시
                            .map(d => d.x)
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legendOffset: -46,
                        legendPosition: 'middle',
                        tickValues: [0, 3, 6, 9, 12, 15, 18]
                    }}
                    enableGridX={false}
                    gridXValues={transformedData[0].data
                        .filter((_, index) => index % 2 === 0)
                        .map(d => d.x)}
                    enableGridY={true}
                    pointSize={4}
                    pointColor="#90EE90"
                    pointBorderWidth={2}
                    pointBorderColor="#90EE90"
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaBaselineValue={0}
                    areaOpacity={0.15}
                    useMesh={true}
                    colors={["#90EE90"]}
                    tooltip={({ point }) => (
                        <div
                            style={{
                                background: 'white',
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <strong>{point.data.x}</strong>
                            <div>나쁜 자세: {point.data.y}회</div>
                        </div>
                    )}
                />
            </div>
            <div style={textBoxStyle}>
                <div style={textBoxTitleStyle}>
                    <h2 style={h2}>일일 나쁜 자세 분석</h2>
                    <p>30분 간격으로 나쁜 자세가 발생한 횟수를 확인해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</p>
                </div>
            </div>
        </div>
    );
};

export default DayChart; 