import { ResponsiveLine } from '@nivo/line';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { postureApi } from '../../api/postureApi';

const Root = styled.div`
    width: 100%;
`;

const ChartBox = styled.div`
    width: 100%;
    height: 60vh;
`;

const TextBoxStyle = styled.div`
    width: 100%;
    padding: 20px;
    background: ${(props) => props.theme.color.lightGreen};
    border-radius: 8px;
    box-shadow: 0 1px 4px 2px rgb(119 119 119 / 25%);
`;

const TitleStyle = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.md};
    color: ${(props) => props.theme.color.green};
    font-weight: 800;
`;
const LineStyle = styled.div`
    width:120px;
    height: 2px;
    background: ${(props) => props.theme.color.green};
    margin-top: 5px;
`;

const TextStyle = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.base};
    color: ${(props) => props.theme.color.black};
    margin-top: 16px;
`;
const userId = localStorage.getItem("username");
const DayChart = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [advice, setAdvice] = useState("");

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
            color: "#3B604B",
            data: generateTestData()
        }];
        setChartData(testData);
        const fetchAdvice = async() => {
            try{
                const result_advice = await postureApi.getAiAdvice(userId);
                setAdvice(result_advice); 
            }
            catch(error){
                console.error("Model을 가져오는데 실패했습니다.",error);
            }
        }
        fetchAdvice();
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
                    color: "#3B604B",
                    data: response.data.map(item => ({
                        x: item.time, // 이 부분 recordedAt으로 사용 백엔드에 time 없음
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
    }, [userId]);

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <ChartBox>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 0, bottom: 70, left: 60 }}
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
                        legendOffset: 50,
                        legendPosition: 'middle',
                        tickValues: chartData[0]?.data
                            .filter((_, index) => index % 2 === 0)
                            .map(d => d.x)
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
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
                    pointColor="#3B604B"
                    pointBorderWidth={2}
                    pointBorderColor="#3B604B"
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaBaselineValue={0}
                    areaOpacity={0.15}
                    useMesh={true}
                    colors={["#3B604B"]}
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
            </ChartBox>
            <TextBoxStyle>
                <TitleStyle>나쁜 자세 분석</TitleStyle>
                <LineStyle />
                <TextStyle>{advice !== null ? advice : "Loading..."}</TextStyle>
            </TextBoxStyle >
        </Root>
    );
};

export default DayChart; 