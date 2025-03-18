import React, { useState, useEffect, useRef } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import styled from "styled-components";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { postureApi } from "../../api/postureApi";
import TurtleImage from "../../assets/images/TurtleImage.svg";

const Root = styled.div`
    width: 100%;
`;

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    & .rdrCalendarWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    & .rdrDateDisplayWrapper {
        display: none;
    }
`;

const LeftBox = styled.div`
    flex-direction: column;
    align-items: center; 
`;

const CalenderBox = styled.div`
    border: 1px solid ${(props) => props.theme.color.grey};
    margin-bottom: 10px;
`;


const ChartBox = styled.div`
    width: calc(100% - 352px);
    height: 638px;
    display:flex;
    justify-content:center;
    align-items: center;
`;

const SmallChartBox = styled.div`
    width: 100%;
    height: 300px;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0px;
    box-sizing: border-box;
    border: 1px solid ${(props) => props.theme.color.grey};
    box-sizing: border-box;
    padding-top: 10px;
`;

const BadMessageBox = styled.div`
    height: 250px;
    display:flex;
    justify-content:center;
    align-items: center;
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

const BadTextStyle = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.sm};
    color: ${(props) => props.theme.color.black};
    font-weight: 800;
    text-align: center
`;

const LineStyle = styled.div`
    width: 120px;
    height: 2px;
    background: ${(props) => props.theme.color.green};
    margin-top: 5px;
`;

const TextStyleAdvice = styled.p`
    margin: 0px;
    font-size: ${(props) => props.theme.fontSize.base};
    color: ${(props) => props.theme.color.black};
    margin-top: 16px;
    white-space: pre-line;
`;

const Message = styled.p`
    font-size: ${(props) => props.theme.fontSize.base};
    color: ${(props) => props.theme.color.black};
    font-weight: 600;
    text-align: center;
    margin: 0px;
`;

const MonthChart = () => {
    const [range, setRange] = useState([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
    const [chartData, setChartData] = useState([]);
    const [topBadPostureHours, setTopBadPostureHours] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [advice, setAdvice] = useState("");
    const [topBadPostureTimes, setTopBadPostureTimes] = useState([]);

    const userId = localStorage.getItem("username");

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                setIsLoading(true);
                const startDate = range[0].startDate.toLocaleDateString("sv-SE");
                const endDate = range[0].endDate.toLocaleDateString("sv-SE");

                const response = await postureApi.getMonthlyPosture(userId, startDate, endDate);
                if (!response || !Array.isArray(response)) {
                    console.warn("서버 응답이 잘못되었습니다.", response);
                    setChartData([]);
                    return;
                }

                const transformedData = response.map(item => {
                    return {
                        month: item.summaryDate.substring(5, 10),
                        "좋은 자세": item.goodPostureCount ?? 0,
                        "나쁜 자세": item.badPostureCount ?? 0,
                    }
                    
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

        const fetchBadPostureHours = async () => {
            try {
                const startDate = range[0].startDate.toLocaleDateString("sv-SE");
                const endDate = range[0].endDate.toLocaleDateString("sv-SE");

                const response = await postureApi.getTopBadPostureHours(userId, startDate, endDate);
                if (!response || !Array.isArray(response)) {
                    console.warn("서버 응답이 잘못되었습니다.", response);
                    setTopBadPostureHours([]);
                    return;
                }

                const transformedData = response.map(item => ({
                    time: item.hour,
                    "나쁜 자세 횟수": item.count,
                }));

                setTopBadPostureHours(transformedData);
            } catch (err) {
                console.error("시간대 데이터를 불러오는데 실패했습니다.", err);
            }
        };

        const fetchAdvice = async () => {
            try {
                const startDate = range[0].startDate.toLocaleDateString("sv-SE");
                const endDate = range[0].endDate.toLocaleDateString("sv-SE");

                const result_advice = await postureApi.getAiMonthlyAdvice(userId, startDate, endDate);
                setAdvice(result_advice);
            } catch (error) {
                console.error("Model을 가져오는데 실패했습니다.", error);
            }
        };

        fetchAdvice();
        fetchMonthlyData();
        fetchBadPostureHours();
    }, [userId, range]);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const fetchTopBadPostureTimes = async () => {
            try {
                const startDate = range[0].startDate.toLocaleDateString("sv-SE");
                const endDate = range[0].endDate.toLocaleDateString("sv-SE");
        
        
                const response = await postureApi.getTopBadPostureHours(userId, startDate, endDate);
        
                if (!response || !Array.isArray(response)) {
                    console.warn("서버 응답이 잘못되었습니다:", response);
                    return;
                }
        
                const sortedTimes = response
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map(item => {
                        let hour = parseInt(item.hour.split(":")[0], 10); // item.time → item.hour
                        hour = (hour + 9) % 24; // UTC → KST 변환
                        return String(hour).padStart(2, "0") + ":00";
                    });
        
        
                setTopBadPostureTimes(sortedTimes);
            } catch (err) {
                console.error("나쁜 자세 상위 시간대를 불러오는데 실패했습니다.", err);
            }
        };
    
        fetchTopBadPostureTimes();
    }, [userId, range]);
    

    useEffect(() => {
        let timeoutId;
    
        const checkAndSendNotification = () => {
            if (!topBadPostureTimes.length) return;
    
            const now = new Date();
            const currentHour = String(now.getHours()).padStart(2, "0") + ":00";
            const today = now.toISOString().split("T")[0];
    
            if (topBadPostureTimes.includes(currentHour)) {
                const notificationKey = `notified_${today}_${currentHour}`;
    
                if (!localStorage.getItem(notificationKey)) {
                    if (Notification.permission === "granted") {
                        new Notification("나쁜 자세 주의!", {
                            body: `평균적으로 ${currentHour}시에 나쁜 자세를 많이 기록했습니다. 올바른 자세를 유지해보아요!`,
                            icon: TurtleImage
                        });
    
                        localStorage.setItem(notificationKey, "true");
                    }
                }
            }
    
            // 1분 후 다시 실행
            timeoutId = setTimeout(checkAndSendNotification, 60000);
        };
    
        checkAndSendNotification(); // 첫 실행
    
        return () => clearTimeout(timeoutId); // 클린업
    }, [topBadPostureTimes]);    


    //-------------------------------------------------------------------------------------------------------------
    // 시연 영상 테스트용 알림
    useEffect(() => {
        const now = new Date();
        const currentHour = String(now.getHours()).padStart(2, "0") + ":00";
        const today = now.toISOString().split("T")[0];
    
        const notificationKey = `notified_${today}_${currentHour}`;
        if (localStorage.getItem(notificationKey)) {
            return;
        }
    
        setTimeout(() => {
            new Notification("나쁜 자세 주의!", {
                body: `평균적으로 ${currentHour}시에 나쁜 자세를 많이 기록했습니다. 올바른 자세를 유지해보아요!`,
                icon: TurtleImage
            });
    
            localStorage.setItem(notificationKey, "true");
        }, 2000);
    }, []);
    //-------------------------------------------------------------------------------------------------------------
    

    if (isLoading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Root>
            <Box>
                <LeftBox>
                    <CalenderBox>
                        <DateRange
                            ranges={range}
                            onChange={(item) => setRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            rangeColors={["#3B604B"]}
                            locale={ko}
                        />  
                    </CalenderBox>
                    

                    <SmallChartBox>
                        <BadTextStyle>가장 나쁜 자세를 기록한 시간대</BadTextStyle>
                        {topBadPostureHours.length === 0 ? (
                            <BadMessageBox>
                                <Message>해당 기간에 대한 데이터가 없습니다.</Message>
                            </BadMessageBox>
                            
                        ) : (
                            <ResponsivePie
                                data={topBadPostureHours.map(item => {
                                    let hour = parseInt(item.time.split(":")[0], 10); // "1:00" → 1
                            
                                    // UTC → 한국 시간 변환 (UTC 1시는 KST 10시)
                                    hour = (hour + 9) % 24;
                            
                                    // 24시간 형식 변환
                                    const formattedHour = String(hour).padStart(2, "0") + ":00";
                            
                                    return {
                                        id: formattedHour,
                                        label: formattedHour,
                                        value: item["나쁜 자세 횟수"],
                                    };
                                })}
                                margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
                                innerRadius={0.5} // 도넛 모양
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: "red_yellow_blue" }} // 색상 스키마
                                borderWidth={1}
                                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextXOffset={6}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkOffset={0}
                                radialLabelsLinkDiagonalLength={16}
                                radialLabelsLinkHorizontalLength={24}
                                radialLabelsLinkStrokeWidth={1}
                                radialLabelsLinkColor={{ from: "color" }}
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="#ffffff"
                            />
                        )}
                    </SmallChartBox>
                </LeftBox>
               
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
                <TextStyleAdvice>{advice !== null ? advice : "Loading..."}</TextStyleAdvice>
            </TextBoxStyle>
        </Root>
    );
};

export default MonthChart;
