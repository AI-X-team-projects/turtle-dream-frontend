import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { postureApi } from "../../api/postureApi";

const Root = styled.div`
    width: 100%;
`;

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    & .rdrCalendarWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    & .rdrDateDisplayWrapper {
        display: none;
    }
`;

const ChartBox = styled.div`
    width: calc(100% - 352px);
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

const Message = styled.p`
    font-size: ${(props) => props.theme.fontSize.lg};
    color: ${(props) => props.theme.color.green};
    font-weight: 600;
    text-align: center;
    margin: 0px;
    margin-top: 220px;
`;


const MonthChart = () => {
    const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("username");

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                setIsLoading(true);
    
                // toISOString() 대신 toLocaleDateString("ko-KR") 사용
                const startDate = range[0].startDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식 유지
                const endDate = range[0].endDate.toLocaleDateString("sv-SE");
    
                console.log(`요청: /api/posture/monthly?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
                const response = await postureApi.getMonthlyPosture(userId, startDate, endDate);
    
                console.log("서버 응답:", response);
    
                if (!response || !Array.isArray(response)) {
                    console.warn("서버 응답이 잘못되었습니다.", response);
                    setChartData([]);
                    return;
                }
    
                // summaryDate를 직접 변환 없이 그대로 사용
                const transformedData = response.map(item => ({
                    month: item.summaryDate.substring(5, 10), // MM-DD 형식으로 변환
                    "좋은 자세": item.goodPostureCount ?? 0,
                    "나쁜 자세": item.badPostureCount ?? 0,
                }));
    
                setChartData(transformedData);
                setError(null);
            } catch (err) {
                setError("데이터를 불러오는데 실패했습니다.");
                console.error("API 오류:", err);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchMonthlyData();
    }, [userId, range]);  
    
    

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <Box>
                {/* 선택한 날짜 범위 저장 */}
                <DateRange
                    ranges={range}
                    onChange={(item) => setRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#3B604B"]}
                    locale={ko}
                />
                <ChartBox>
                    {/* 데이터가 없을 경우 "데이터가 없습니다" 문구 출력 */}
                    {chartData.length === 0 ? (
                        <Message>선택한 기간에 대한 데이터가 없습니다.</Message>
                    ) : (
                    <ResponsiveBar
                        data={chartData}
                        keys={["좋은 자세", "나쁜 자세"]}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                        padding={0.3}
                        groupMode="grouped"
                        valueScale={{ type: "linear" }}
                        indexScale={{ type: "band", round: true }}
                        colors={["#3B604B", "#FFB6C1"]}
                        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: "날짜",
                            legendPosition: "middle",
                            legendOffset: 40,
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "횟수",
                            legendPosition: "middle",
                            legendOffset: -50,
                        }}
                        enableGridY={true}
                        enableLabel={true}
                        legends={[
                            {
                                dataFrom: "keys",
                                anchor: "bottom-right",
                                direction: "column",
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: "left-to-right",
                                itemOpacity: 0.85,
                                symbolSize: 20,
                            },
                        ]}
                        role="application"
                        ariaLabel="월별 자세 분석"
                        barAriaLabel={(e) => `${e.id}: ${e.formattedValue}회`}
                    />
                    )}
                </ChartBox>
            </Box>
            <TextBoxStyle>
                <TitleStyle>월별 자세 분석</TitleStyle>
                <LineStyle />
                <TextStyle>
                    선택한 날짜 범위에서 좋은 자세와 나쁜 자세의 발생 횟수를 비교해보세요.
                </TextStyle>
            </TextBoxStyle>
        </Root>
    );
};

export default MonthChart;
