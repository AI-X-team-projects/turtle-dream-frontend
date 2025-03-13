import React, { useState, useEffect } from "react";
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import { DateRange } from "react-date-range";
import { postureApi } from '../../api/postureApi';
import { ko } from "date-fns/locale";

const Root = styled.div`
    width: 100%;
`;

const Box = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ChartBox = styled.div`
    width: calc(100% - 352px);
    height: 60vh;
`;

const MonthChart = ({ userId }) => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                setIsLoading(true);
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
                const response = await postureApi.getMonthlyPosture(userId, year, month);

                const transformedData = response.map(item => ({
                    month: `${item.month}월`,
                    "좋은 자세": item.goodPostureCount,
                    "나쁜 자세": item.badPostureCount
                }));

                setChartData(transformedData);
            } catch (error) {
                console.error("월별 데이터 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonthlyData();
    }, [userId]);

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <Root>
            <Box>
                <DateRange
                    ranges={range}
                    onChange={(item) => setRange([item.selection])}
                    locale={ko}
                />
                <ChartBox>
                    <ResponsiveBar
                        data={chartData}
                        keys={["좋은 자세", "나쁜 자세"]}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                        colors={["#3B604B", "#FFB6C1"]}
                        axisBottom={{ tickSize: 5, tickPadding: 5 }}
                    />
                </ChartBox>
            </Box>
        </Root>
    );
};

export default MonthChart;
