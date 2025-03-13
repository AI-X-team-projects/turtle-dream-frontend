import { ResponsiveLine } from '@nivo/line';
import { useEffect, useState } from 'react';
import { postureApi } from '../../api/postureApi';

const DayChart = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const h2 = {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#3B604B'
    };

    const p = {
        fontSize: '16px',
        color: '#303030'
    };

    const textBoxTitleStyle = {
        marginBottom: '10px'
    };

    // 테스트용 데이터 생성 함수
    const generateTestData = () => {
        const data = [];
        const startHour = 9;
        const endHour = 18;

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                // 0에서 18 사이의 랜덤한 값 생성
                const badPostureCount = Math.floor(Math.random() * 12);
                data.push({
                    x: time,
                    y: badPostureCount
                });
            }
        }
        return data;
    };

    useEffect(() => {
        // API 연동 전 테스트 데이터 사용
        const testData = [{
            id: "나쁜 자세 횟수",
            color: "#90EE90",
            data: generateTestData()
        }];
        setChartData(testData);
        setIsLoading(false);

        // API 연동 코드는 주석 처리
        /*
        const fetchDailyData = async () => {
            try {
                setIsLoading(true);
                const today = new Date().toISOString().split('T')[0];
                const response = await postureApi.getDailyPosture(today);
                
                const transformedData = [{
                    id: "나쁜 자세 횟수",
                    color: "#90EE90",
                    data: response.data.map(item => ({
                        x: item.time,
                        y: item.badPostureCount
                    }))
                }];
                
                setChartData(transformedData);
                setError(null);
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('Error fetching daily posture data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDailyData();
        */
    }, []);

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <ResponsiveLine
                    data={chartData}
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
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: '시간',
                        legendOffset: 50,
                        legendPosition: 'middle',
                        tickValues: chartData[0]?.data
                            .filter((_, index) => index % 2 === 0)
                            .map(d => d.x)
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legend: '나쁜 자세 횟수',
                        legendOffset: -46,
                        legendPosition: 'middle',
                        tickValues: [0, 3, 6, 9, 12, 15, 18]
                    }}
                    enableGridX={true}
                    gridXValues={chartData[0]?.data
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
                    <p style={p}>30분 간격으로 나쁜 자세가 발생한 횟수를 확인해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</p>
                </div>
            </div>
        </div>
    );
};

export default DayChart; 