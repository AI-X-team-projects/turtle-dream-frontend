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

const MonthChart = () => {
    const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1; // JS에서 getMonth()는 0부터 시작하므로 +1 해야됨

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                setIsLoading(true);
                console.log(`요청: /api/posture/monthly?userId=${userId}&year=${year}&month=${month}`);
                const response = await postureApi.getMonthlyPosture(userId, year, month);

                console.log("서버 응답:", response);

                // 서버 응답이 배열인지 확인
                if (!response || !Array.isArray(response)) {
                    console.warn("❌ 서버 응답이 잘못되었습니다.", response);
                    setChartData([]);
                    return;
                }

                // summaryDate가 없을 경우 대비하여 변환
                const transformedData = response.map(item => {
                    if (!item.summaryDate) {
                        console.warn("⚠️ 'summaryDate' 필드가 없습니다. item:", item);
                        return { month: "Unknown", "좋은 자세": 0, "나쁜 자세": 0 };
                    }

                    return {
                        month: `${item.summaryDate?.substring(5, 7) ?? "Unknown"}월`,
                        "좋은 자세": item.totalGoodPosture ?? 0,
                        "나쁜 자세": item.totalBadPosture ?? 0,
                    };
                });

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
    }, []);

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <Box>
                <DateRange
                    ranges={range}
                    onChange={(item) => setRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#3B604B"]} // 선택한 날짜 색상 (짙은 녹색)
                    locale={ko} // 한국어 설정
                />
                <ChartBox>
                    <ResponsiveBar
                        data={chartData}
                        keys={["좋은 자세", "나쁜 자세"]}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                        padding={0.3}
                        groupMode="grouped"
                        valueScale={{ type: "linear" }}
                        indexScale={{ type: "band", round: true }}
                        colors={["#3B604B", "#FFB6C1"]} // 좋은 자세는 연한 초록색, 나쁜 자세는 연한 빨간색
                        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: "월",
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
                </ChartBox>
            </Box>
            <TextBoxStyle>
                <TitleStyle>월별 자세 분석</TitleStyle>
                <LineStyle />
                <TextStyle>
                    월별 좋은 자세와 나쁜 자세의 발생 횟수를 비교해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.
                </TextStyle>
            </TextBoxStyle>
        </Root>
    );
};

export default MonthChart;
