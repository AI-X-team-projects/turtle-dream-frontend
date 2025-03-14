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
`;

const TitleStyle = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.md};
    color: ${(props) => props.theme.color.green};
    font-weight: 800;
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

const DayChart = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId") || "defaultUser";
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchDailyData = async () => {
            try {
                setIsLoading(true);
                console.log(`요청: /api/posture/daily?userId=${userId}&date=${today}`);
                const response = await postureApi.getDailyPosture(userId, today);
    
                console.log("서버 응답:", response);
    
                if (!response || !Array.isArray(response)) {
                    console.error("서버 응답이 올바르지 않습니다.", response);
                    setChartData([]);
                    return;
                }
    
                // 1시간 단위 그룹화 (09시~18시 모든 시간을 포함)
                const groupedData = {};
                for (let hour = 9; hour < 18; hour++) {
                    groupedData[`${hour}시`] = 0; // 기본값 0으로 초기화
                }
    
                response.forEach((item) => {
                    if (!item.recordedAt) return;
    
                    // 여기서 시간(HH) 추출 예를들어 16시나 17시
                    const hour = item.recordedAt.split("T")[1]?.substring(0, 2) + "시" || "Unknown";
    
                    // 그룹화하여 badPostureDuration 누적
                    if (!groupedData[hour]) {
                        groupedData[hour] = 0;
                    }
                    groupedData[hour] += item.badPostureDuration || 0;
                });
    
                // 여기서 차트 형식으로 변환
                const transformedData = [
                    {
                        id: "나쁜 자세 횟수",
                        color: "#3B604B",
                        data: Object.keys(groupedData)
                            .map((hour) => ({
                                x: hour, // 시간(HH시)
                                y: groupedData[hour], // badPostureDuration 총합
                            }))
                            .sort((a, b) => parseInt(a.x) - parseInt(b.x)), // 시간 순 정렬 (09시, 10시, ... 17시)
                    },
                ];
    
                setChartData(transformedData);
                setError(null);
            } catch (err) {
                setError("데이터를 불러오는데 실패했습니다.");
                console.error("❌ API 오류:", err);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchDailyData();
    }, [userId, today]);    

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <ChartBox>
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: 0,
                        max: 12,
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
                <TextStyle>1시간 간격으로 나쁜 자세 지속 시간을 확인하세요.</TextStyle>
            </TextBoxStyle>
        </Root>
    );
};

export default DayChart;
