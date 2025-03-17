import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";
import { postureApi } from "../../api/postureApi";

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
    box-sizing: border-box;
`;

const TitleStyle = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.md};
    color: ${(props) => props.theme.color.green};
    font-weight: 800;
`;
const TextStyleAdvice = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.base};
    color: ${(props) => props.theme.color.black};
    margin-top: 16px;
    white-space: pre-line;
`;

const LineStyle = styled.div`
    width: 120px;
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

const Controls = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const Select = styled.select`
    padding: 5px;
    font-size: ${(props) => props.theme.fontSize.base};
`;



const DayChart = () => {
    const [chartData, setChartData] = useState([]);
    const [maxYValue, setMaxYValue] = useState(200); // 기본값 200
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startHour, setStartHour] = useState(9); // 기본값: 9시
    const [endHour, setEndHour] = useState(18); // 기본값: 18시
    const [advice, setAdvice] = useState("");

    const userId = localStorage.getItem("username") || "defaultUser";
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchDailyData = async () => {
            try {
                setIsLoading(true);
                const response = await postureApi.getDailyPosture(userId, today);
              
                if (!response || !Array.isArray(response)) {
                    console.error("서버 응답이 올바르지 않습니다.", response);
                    setChartData([]); // 오류 발생 방지
                    return;
                }
    
                // 사용자가 설정한 시작 시간과 종료 시간 반영
                const groupedData = {};
                for (let hour = startHour; hour <= endHour; hour++) {
                    groupedData[`${hour}시`] = 0;
                }
    
                response.forEach((item) => {
                    if (!item.recordedAt) return;
    
                    const hour = parseInt(item.recordedAt.split("T")[1]?.substring(0, 2), 10);
                    if (hour >= startHour && hour <= endHour) {
                        const hourLabel = `${hour}시`;
                        if (!groupedData[hourLabel]) {
                            groupedData[hourLabel] = 0;
                        }
                        groupedData[hourLabel] += item.badPostureDuration || 0;
                    }
                });
    
                const transformedData = [
                    {
                        id: "나쁜 자세 횟수",
                        color: "#3B604B",
                        data: Object.keys(groupedData)
                            .map((hour) => ({
                                x: hour,
                                y: groupedData[hour],
                            }))
                            .sort((a, b) => parseInt(a.x) - parseInt(b.x)), // 시간 순 정렬
                    },
                ];
    
                // 데이터가 비어 있을 경우 빈 배열 설정 (오류 방지)
                if (!transformedData[0]?.data.length) {
                    console.warn("변환된 데이터가 비어 있음", transformedData);
                    setChartData([]);
                    return;
                }
    
                const maxDataValue = Math.max(...transformedData[0].data.map((d) => d.y), 200);
                setMaxYValue(maxDataValue + 100);
    
                setChartData(transformedData);
                setError(null);
            } catch (err) {
                setError("데이터를 불러오는데 실패했습니다.");
                console.error("API 오류:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchAdvice = async() => {
                    try{
                        const result_advice = await postureApi.getAiDailyAdvice(userId);
                        setAdvice(result_advice); 
                    }
                    catch(error){
                        console.error("Model을 가져오는데 실패했습니다.",error);
                    }
        }
        fetchAdvice();
        setIsLoading(false);   
        fetchDailyData();
    }, [userId, today, startHour, endHour]); 
    

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <Controls>
                <label>
                    시작 시간:
                    <Select value={startHour} onChange={(e) => setStartHour(parseInt(e.target.value))}>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                                {i}시
                            </option>
                        ))}
                    </Select>
                </label>
                <label>
                    종료 시간:
                    <Select value={endHour} onChange={(e) => setEndHour(parseInt(e.target.value))}>
                        {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                                {i}시
                            </option>
                        ))}
                    </Select>
                </label>
            </Controls>

            <ChartBox>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: 0,
                        max: maxYValue,
                        stacked: false,
                        reverse: false,
                    }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legendOffset: 50,
                        legendPosition: "middle",
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legendOffset: -46,
                        legendPosition: "middle",
                    }}
                    enableGridX={true}
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
                                background: "white",
                                padding: "9px 12px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
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
                <TextStyleAdvice>{advice !== null ? advice : "Loading..."}</TextStyleAdvice>
            </TextBoxStyle>
        </Root>
    );
};

export default DayChart;
