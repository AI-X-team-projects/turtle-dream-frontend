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
  white-space: pre-line;
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

const TextStyleAdvice = styled.p`
  margin: 0px;
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.color.black};
  margin-top: 16px;
  white-space: pre-line;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  margin-left: 30px;
`;

const Select = styled.select`
  padding: 5px 10px;
  font-size: ${(props) => props.theme.fontSize.base};
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.color.grey};
  border-radius: 8px;
`;

const DayChart = () => {
  const [chartData, setChartData] = useState([]);
  const [maxYValue, setMaxYValue] = useState(200);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(18);
  const [advice, setAdvice] = useState("");

  const userId = localStorage.getItem("username") || "defaultUser";
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const response = await postureApi.getDailyPosture(userId, today);

        if (!response || !Array.isArray(response)) {
          console.warn("서버 응답 오류:", response);
          setChartData([]);
          return;
        }

        const groupedData = {};
        for (let hour = startHour; hour <= endHour; hour++) {
          groupedData[`${hour}시`] = 0;
        }

        response.forEach((item) => {
          if (!item.recordedAt) return;

          const hour = parseInt(item.recordedAt.split("T")[1]?.substring(0, 2), 10);

          if (hour >= startHour && hour <= endHour) {
            const hourLabel = `${hour}시`;
            groupedData[hourLabel] = (groupedData[hourLabel] || 0) + (item.badPostureDuration || 0);
          }
        });

        const transformedData = [
          {
            id: "나쁜 자세 횟수",
            color: "#3B604B",
            data: Object.keys(groupedData)
              .map((hour) => ({
                x: hour,
                y: groupedData[hour] ?? 0,
              }))
              .sort((a, b) => parseInt(a.x) - parseInt(b.x)),
          }
        ];

        if (!transformedData[0]?.data?.length) {
          setChartData([]);
          return;
        }

        setChartData(transformedData);

        // 최대 나쁜 자세 횟수 찾기
        const maxBadPostureCount = Math.max(...transformedData[0].data.map((d) => d.y), 0);
        setMaxYValue(maxBadPostureCount + 100); // +100 여유 추가

      } catch (err) {
        console.error("API 오류:", err);
      }
    };

    const fetchAdvice = async () => {
      try {
        const result_advice = await postureApi.getAiDailyAdvice(userId);
        setAdvice(result_advice);
      } catch (error) {
        console.error("Model을 가져오는데 실패했습니다.", error);
      }
    };

    fetchAdvice();
    fetchDailyData();
  }, [userId, today, startHour, endHour]);

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
        <p> ~ </p>
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
        {chartData.length > 0 && chartData[0]?.data?.length > 0 ? (
          <ResponsiveLine
            data={chartData}
            margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: maxYValue,
              stacked: false,
              reverse: false,
            }}
            curve="monotoneX"
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
            areaOpacity={0.15}
            useMesh={true}
            colors={["#3B604B"]}
            tooltip={({ point }) => (
              <div style={{ background: "white", padding: "9px 12px", border: "1px solid #ccc", borderRadius: "4px" }}>
                <strong>{point.data.x}</strong>
                <div>나쁜 자세: {point.data.y}회</div>
              </div>
            )}
          />
        ) : (
          <div>차트 데이터가 없습니다.</div>
        )}
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
