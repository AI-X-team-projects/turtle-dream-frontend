import React, {useState} from "react";
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // 기본 스타일
import "react-date-range/dist/theme/default.css"; // 테마 스타일
import { ko } from "date-fns/locale";

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

const MonthChart = () => {
    const [range, setRange] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
    ]);

    // 월별 데이터 (좋은 자세와 나쁜 자세를 하나의 객체로 통합)
    const data = [
        { month: '1월', '좋은 자세': 120, '나쁜 자세': 80 },
        { month: '2월', '좋은 자세': 198, '나쁜 자세': 98 },
        { month: '3월', '좋은 자세': 87, '나쁜 자세': 107 },
        { month: '4월', '좋은 자세': 145, '나쁜 자세': 205 }
    ];

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
                        data={data}
                        keys={['좋은 자세', '나쁜 자세']}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
                        padding={0.3}
                        groupMode="grouped"
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={['#3B604B', '#FFB6C1']} // 좋은 자세는 연한 초록색, 나쁜 자세는 연한 빨간색
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                    
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20
                            }
                        ]}
                        role="application"
                        ariaLabel="월별 자세 분석"
                        barAriaLabel={e => `${e.id}: ${e.formattedValue}회`}
                    />
                </ChartBox>
            </Box>
            <TextBoxStyle>
                <TitleStyle>월별 자세 분석</TitleStyle>
                <LineStyle />
                <TextStyle>월별 좋은 자세와 나쁜 자세의 발생 횟수를 비교해보세요. 추후에 G선생님이 알아서 분석해서 추천해줄 것입니다.</TextStyle>
            </TextBoxStyle>
        </Root>
    );
};

export default MonthChart; 