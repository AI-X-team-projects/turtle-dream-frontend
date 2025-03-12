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
        width: '90vw',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const textBoxTitleStyle = {
        marginBottom: '10px'
    };

    // 일일 데이터
    const rawData = [
        {
            name: '망나뇽',
            postuer: "good",
            date: '2025-03-11',
            time: '12:00',   
        },
        {
            name: '망나뇽',
            postuer: "bad",
            date: '2025-03-11',
            time: '13:00',   
        },
        {
            name: '망나뇽',
            postuer: "bad",
            date: '2025-03-11',
            time: '14:00',   
        },
        {
            name: '망나뇽',
            postuer: "good",
            date: '2025-03-11',
            time: '15:00',   
        },
        {
            name: '망나뇽',
            postuer: "good",
            date: '2025-03-11',
            time: '16:00',   
        },
        {
            name: '망나뇽',
            postuer: "bad",
            date: '2025-03-11',
            time: '17:00',   
        }
    ];

    // 데이터 변환
    const transformedData = [
        {
            id: "자세 상태",
            color: "#90EE90",
            data: rawData.map(item => ({
                x: item.time,
                y: item.postuer === "good" ? 1 : 0,
                posture: item.postuer
            }))
        }
    ];

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <ResponsiveLine
                    data={transformedData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: -0.1,
                        max: 1.1,
                        stacked: true,
                        reverse: false
                    }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: '시간',
                        legendOffset: 40,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '자세 상태 (0: 나쁨, 1: 좋음)',
                        legendOffset: -46,
                        legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor="#90EE90"
                    colors={["#90EE90"]}
                    fillOpacity={0.6}
                    enableArea={true}
                    areaOpacity={0.3}
                    enableTouchCrosshair={true}
                    useMesh={true}
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
                            <div>{point.data.y === 1 ? '자세 좋음' : '자세 나쁨'}</div>
                        </div>
                    )}
                />
            </div>
            <div style={textBoxStyle}>
                <div style={textBoxTitleStyle}>
                    <h2>일일 자세 분석</h2>
                    <p>오늘 하루 자세 현황을 확인해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</p>
                </div>
            </div>
        </div>
    );
};

export default DayChart; 