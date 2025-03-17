import React from "react";
import styled from "styled-components";
import { useWebSocket } from "../common/WebSocketProvider";

const FeedbackContainer = styled.div`
  margin-bottom: 15px;
  padding: 12px;
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

const PostureFeedback = ({ userId }) => {
  const {
    isConnected,
    currentAlert,
    postureData,
    acknowledgeAlert,
    connectionError,
  } = useWebSocket();

  // 자세 상태에 따른 메시지와 심각도 결정
  const getPostureInfo = (alert, postureData) => {
    // 알림이 있는 경우 알림 정보 사용
    if (alert) {
      return {
        message: alert.message || "자세를 확인하세요",
        description:
          alert.description || "바른 자세를 유지하는 것이 중요합니다",
        severity: alert.severity || "medium",
        duration: alert.duration || null,
      };
    }

    // 알림이 없는 경우 postureData 사용
    if (postureData) {
      if (postureData.isGoodPosture) {
        return {
          message: "자세가 좋습니다",
          description: "계속 유지하세요",
          severity: "low",
          duration: null,
        };
      } else {
        // postureStatus에 따른 메시지 설정
        let message = postureData.feedback || "자세를 확인하세요";
        let description = "바른 자세를 유지하는 것이 중요합니다";
        let severity = "medium";

        // 나쁜 자세 지속 시간에 따라 심각도 조정
        if (postureData.badPostureDuration) {
          const minutes = Math.floor(postureData.badPostureDuration / 60);
          const seconds = postureData.badPostureDuration % 60;

          if (postureData.badPostureDuration > 300) {
            // 5분 이상
            severity = "high";
            description =
              "오랜 시간 나쁜 자세를 유지하고 있습니다. 잠시 휴식을 취하세요.";
          } else if (postureData.badPostureDuration > 60) {
            // 1분 이상
            severity = "medium";
            description = "자세를 바로잡고 스트레칭을 해보세요.";
          }

          return {
            message: message,
            description: description,
            severity: severity,
            duration: `${minutes}분 ${seconds}초 동안 지속됨`,
          };
        }

        return {
          message: message,
          description: description,
          severity: severity,
          duration: null,
        };
      }
    }

    // 기본 메시지
    return {
      message: "자세 측정 중...",
      description: "잠시만 기다려주세요",
      severity: "low",
      duration: null,
    };
  };

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

  const { message, description, severity, duration } = getPostureInfo(
    currentAlert,
    postureData
  );

  return (
    <FeedbackContainer $severity={severity}>
      <AlertMessage>{message}</AlertMessage>
      <AlertDescription>{description}</AlertDescription>
      {duration && <DurationInfo>{duration}</DurationInfo>}
      {currentAlert && (
        <AcknowledgeButton onClick={() => acknowledgeAlert(currentAlert.id)}>
          확인
        </AcknowledgeButton>
      )}
    </FeedbackContainer>
  );
};

export default PostureFeedback;
