import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWebSocket } from "../common/WebSocketProvider";

const FeedbackContainer = styled.div`
  margin-bottom: 15px;
  padding: 12px;
  width: 79%;
  border-radius: 8px;
  font-size: ${(props) => props.theme.fontSize.sm};
  text-align: center;
  background-color: ${(props) =>
    props.$severity === "high"
      ? props.theme.color.red
      : props.$severity === "medium"
      ? "#FFA500" // 주황색
      : props.theme.color.green};
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
`;

const AlertMessage = styled.div`
  font-weight: 600;
`;

const AlertDescription = styled.div`
  font-size: ${(props) => props.theme.fontSize.xs};
`;

const DurationInfo = styled.div`
  font-size: ${(props) => props.theme.fontSize.xs};
  font-style: italic;
  margin-top: 4px;
`;

const AcknowledgeButton = styled.button`
  background-color: white;
  color: ${(props) => props.theme.color.black};
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: ${(props) => props.theme.fontSize.xs};
  cursor: pointer;
  align-self: center;
  margin-top: 4px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const PostureFeedback = () => {
  const {
    isConnected,
    currentAlert,
    postureData,
    acknowledgeAlert,
    connectionError,
  } = useWebSocket();

  const [lastAlertTime, setLastAlertTime] = useState(0);

  useEffect(() => {
    if (postureData && !postureData.isGoodPosture) {
      const badPostureDuration = postureData.badPostureDuration || 0;

      // console.log(`나쁜 자세 유지 시간: ${badPostureDuration}초`);
      // console.log(`마지막 알림 시간: ${lastAlertTime}초`);

      // 현재 시간이 마지막 알림 이후 5분(300초) 이상인지 확인
      if (badPostureDuration >= 60 && (badPostureDuration - lastAlertTime) >= 300) {
        if (Notification.permission === "granted") {
          new Notification("나쁜 자세 경고", {
            body: `${Math.floor(badPostureDuration / 60)}분 ${
              badPostureDuration % 60
            }초 동안 나쁜 자세를 유지하고 있습니다. 바른 자세로 돌아가세요.`,
          });

          // console.log("알림 전송 완료");
          setLastAlertTime(badPostureDuration);
        } else {
          console.log("알림 권한 없음");
        }
      }
    }
  }, [postureData]);

  // 연결되지 않은 경우
  if (!isConnected) {
    return (
      <FeedbackContainer $severity="low">
        <AlertMessage>서버에 연결되지 않음</AlertMessage>
        <AlertDescription>
          AI 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.
        </AlertDescription>
      </FeedbackContainer>
    );
  }

  // 연결 오류가 있는 경우
  if (connectionError) {
    return (
      <FeedbackContainer $severity="high">
        <AlertMessage>연결 오류</AlertMessage>
        <AlertDescription>{connectionError}</AlertDescription>
      </FeedbackContainer>
    );
  }

  // 자세가 좋은 경우
  if (postureData && postureData.isGoodPosture) {
    return (
      <FeedbackContainer $severity="low">
        <AlertMessage>자세가 좋습니다</AlertMessage>
        <AlertDescription>계속 유지하세요</AlertDescription>
      </FeedbackContainer>
    );
  }

  // 자세가 나쁜 경우 - 알림이 있으면 알림 정보 사용
  if (currentAlert) {
    // 알림 정보에서 심각도 결정
    const severity = currentAlert.severity || "medium";

    // 시간 정보 계산
    let durationText = null;
    if (
      postureData &&
      postureData.badPostureDuration &&
      postureData.badPostureDuration > 0
    ) {
      const minutes = Math.floor(postureData.badPostureDuration / 60);
      const seconds = postureData.badPostureDuration % 60;
      durationText = `${minutes}분 ${seconds}초 동안 지속됨`;
    }

    return (
      <FeedbackContainer $severity={severity}>
        <AlertMessage>{currentAlert.message}</AlertMessage>
        <AlertDescription>{currentAlert.description}</AlertDescription>
        {durationText && <DurationInfo>{durationText}</DurationInfo>}
        <AcknowledgeButton onClick={() => acknowledgeAlert(currentAlert.id)}>
          확인
        </AcknowledgeButton>
      </FeedbackContainer>
    );
  }

  // 자세가 나쁘지만 알림이 없는 경우 (5초 미만 지속)
  if (postureData && !postureData.isGoodPosture) {
    const message = postureData.feedback || "자세를 확인하세요";
    let description = "바른 자세를 유지하는 것이 중요합니다";
    let severity = "medium";
    let durationText = null;

    if (postureData.badPostureDuration) {
      const minutes = Math.floor(postureData.badPostureDuration / 60);
      const seconds = postureData.badPostureDuration % 60;
      durationText = `${minutes}분 ${seconds}초 동안 지속됨`;

      description = `${minutes}분 ${seconds}초 동안 나쁜 자세를 유지하고 있습니다. 바른 자세로 돌아가세요.`;
    }

    return (
      <FeedbackContainer $severity={severity}>
        <AlertMessage>{message}</AlertMessage>
        <AlertDescription>{description}</AlertDescription>
        {durationText && <DurationInfo>{durationText}</DurationInfo>}
      </FeedbackContainer>
    );
  }

  // 기본 메시지
  return (
    <FeedbackContainer $severity="low">
      <AlertMessage>자세 측정 중...</AlertMessage>
      <AlertDescription>잠시만 기다려주세요</AlertDescription>
    </FeedbackContainer>
  );
};

export default PostureFeedback;
