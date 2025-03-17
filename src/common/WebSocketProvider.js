import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";

/**
 * WebSocket 컨텍스트 생성
 * WebSocket 관련 상태와 함수들을 전역적으로 관리하기 위한 Context
 */
const WebSocketContext = createContext(null);

/**
 * WebSocket 커스텀 훅
 * 컴포넌트에서 WebSocket 기능을 사용할 수 있게 해주는 훅
 * WebSocketProvider 내부에서만 사용 가능
 */
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

// WebSocket 상태 상수
const WS_READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

/**
 * WebSocket 프로바이더 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 자식 컴포넌트들
 * @param {string} props.userId - 사용자 ID
 */
export const WebSocketProvider = ({ children, userId }) => {
  // 상태 관리
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
  const [isActive, setIsActive] = useState(false); // WebSocket 활성화 상태
  const [connectionError, setConnectionError] = useState(null); // 연결 오류 상태
  const [postureData, setPostureData] = useState({
    // 자세 데이터 상태
    isGoodPosture: false,
    postureStatus: "Unknown",
    feedback: "",
  });
  // 자세 알림 상태 추가
  const [postureAlerts, setPostureAlerts] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  // 마지막 알림 시간을 저장하는 ref 추가
  const lastAlertTimeRef = useRef({});
  // 이전 자세 상태를 저장하는 ref 추가
  const prevPostureRef = useRef({ isGoodPosture: true });

  // refs
  const ws = useRef(null); // WebSocket 인스턴스 참조
  const reconnectTimeout = useRef(null); // 재연결 타이머 참조
  const reconnectAttempts = useRef(0); // 재연결 시도 횟수
  const MAX_RECONNECT_ATTEMPTS = 5;

  /**
   * WebSocket 연결 함수
   * SockJS를 사용하여 서버와 WebSocket 연결을 설정하고
   * 각종 이벤트 핸들러(open, message, close, error)를 설정
   */
  const connectWebSocket = () => {
    if (!isActive) return;

    try {
      // 기존 연결 정리
      if (ws.current) {
        console.log("기존 WebSocket 연결 종료");
        ws.current.close();
        ws.current = null;
      }

      // 재연결 타이머 정리
      if (reconnectTimeout.current) {
        console.log("재연결 타이머 정리");
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      // 재연결 횟수 체크
      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error("WebSocket 최대 재연결 시도 횟수 초과. 연결 중단.");
        setConnectionError("연결 실패: 서버와 연결할 수 없습니다.");
        return;
      }

      // 연결 시도 횟수 증가
      reconnectAttempts.current += 1;

      console.log(`WebSocket 연결 시도... (시도 ${reconnectAttempts.current})`);
      setConnectionError(null);

      // SockJS 인스턴스 생성 및 연결 (상대 경로 사용)
      console.log("SockJS 인스턴스 생성 시작");
      const sockjs = new SockJS("http://localhost:8080/ws/posture", null, {
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
        debug: true,
      });

      console.log("SockJS 인스턴스 생성됨:", sockjs);
      console.log("SockJS 상태:", sockjs.readyState);
      console.log("SockJS URL:", sockjs.url);

      ws.current = sockjs;

      // 연결 성공 이벤트 핸들러
      ws.current.onopen = () => {
        console.log("WebSocket 연결 성공!");
        console.log("WebSocket 상태:", ws.current.readyState);
        console.log("WebSocket URL:", ws.current.url);
        console.log("WebSocket 프로토콜:", ws.current.protocol);

        setIsConnected(true);
        reconnectAttempts.current = 0; // 연결 성공 시 시도 횟수 초기화

        // WebSocket이 정상적으로 열린 경우만 사용자 등록 메시지 전송
        if (ws.current.readyState === WebSocket.OPEN) {
          try {
            const registerMessage = JSON.stringify({
              type: "REGISTER",
              userId: userId || localStorage.getItem("username") || "anonymous",
            });
            ws.current.send(registerMessage);
            console.log("사용자 등록 메시지 전송 완료");
          } catch (error) {
            console.error("사용자 등록 메시지 전송 중 오류:", error);
          }
        }
      };

      // 메시지 수신 핸들러
      ws.current.onmessage = (event) => {
        console.log("WebSocket 메시지 수신:", event.data);
      };

      // WebSocket 오류 처리
      ws.current.onerror = (error) => {
        console.error("WebSocket 오류 발생:", error);
      };

      // WebSocket 닫힐 때 (비정상 종료 포함) → 자동 재연결
      ws.current.onclose = () => {
        console.warn("WebSocket 연결 종료됨.");

        ws.current = null; // WebSocket 객체 정리

        if (isActive) {
          console.log("🔄 WebSocket 재연결 시도...");
          reconnectTimeout.current = setTimeout(() => {
            connectWebSocket();
          }, 3000); // 3초 후 재연결
        }
      };

      // 메시지 수신 이벤트 핸들러
      ws.current.onmessage = (event) => {
        try {
          console.log("서버로부터 원시 데이터 수신:", event.data);
          const data = JSON.parse(event.data);
          if (data.error) {
            console.error("서버 에러:", data.error);
            return;
          }
          console.log("서버로부터 받은 데이터:", data);

          // 자세 데이터 업데이트 - 데이터 구조에 맞게 수정
          if (data.message === "이미지 분석 성공" && data.analysis) {
            const analysis = data.analysis;

            // 이전 자세가 좋았는데 현재 자세가 나쁜 경우 (자세가 좋았다가 나빠진 경우)
            if (
              prevPostureRef.current.isGoodPosture &&
              !analysis.is_good_posture
            ) {
              console.log(
                "자세가 좋았다가 나빠졌습니다. 자세 지속 시간을 초기화합니다."
              );
              // 서버에서 받은 데이터를 수정하여 지속 시간을 초기화
              analysis.bad_posture_duration = 0;
            }

            // 현재 자세 상태 저장
            prevPostureRef.current = {
              isGoodPosture: analysis.is_good_posture,
            };

            setPostureData({
              isGoodPosture: analysis.is_good_posture,
              postureStatus: analysis.posture_status,
              feedback: analysis.feedback,
              badPostureDuration: analysis.bad_posture_duration,
              recordedAt: analysis.recorded_at,
            });

            // 자세가 나쁜 경우 알림 처리
            if (
              !analysis.is_good_posture &&
              analysis.bad_posture_duration > 5
            ) {
              const now = Date.now();
              const alertType = analysis.posture_status;

              // 항상 최신 정보로 알림 생성
              const newAlert = {
                id: `alert-${alertType}`, // 알림 ID를 타입 기반으로 고정하여 항상 같은 알림을 업데이트하도록 함
                type: alertType,
                message: analysis.feedback,
                description: `${Math.floor(
                  analysis.bad_posture_duration / 60
                )}분 ${
                  analysis.bad_posture_duration % 60
                }초 동안 나쁜 자세를 유지하고 있습니다.`,
                severity:
                  analysis.bad_posture_duration > 300 ? "high" : "medium",
                timestamp: analysis.recorded_at,
                acknowledged: false,
                duration: analysis.bad_posture_duration,
              };

              // 현재 알림 업데이트
              setCurrentAlert(newAlert);

              // 알림 목록 업데이트
              setPostureAlerts((prevAlerts) => {
                // 같은 유형의 알림이 이미 있는지 확인
                const existingAlertIndex = prevAlerts.findIndex(
                  (alert) => alert.type === alertType
                );

                // 같은 유형의 알림이 있으면 업데이트
                if (existingAlertIndex >= 0) {
                  const updatedAlerts = [...prevAlerts];
                  updatedAlerts[existingAlertIndex] = newAlert;
                  return updatedAlerts;
                }

                // 새 알림 추가
                return [newAlert, ...prevAlerts];
              });
            } else if (analysis.is_good_posture && currentAlert) {
              // 자세가 좋아졌을 때 현재 알림이 있으면 자동으로 확인 처리
              console.log("자세가 좋아졌습니다. 알림을 자동으로 제거합니다.");

              // 알림 목록에서 현재 알림 제거
              setPostureAlerts((prevAlerts) => {
                return prevAlerts.filter(
                  (alert) => alert.id !== currentAlert.id
                );
              });

              // 현재 알림 초기화
              setCurrentAlert(null);

              // 마지막 알림 시간 초기화 (모든 알림 타입에 대해)
              lastAlertTimeRef.current = {};
              console.log("마지막 알림 시간 초기화됨");
            }
          }

          // 기존 POSTURE_ALERT 처리 로직 유지
          if (data.type === "POSTURE_ALERT") {
            // 새로운 알림이 도착하면 알림 목록에 추가
            const newAlert = {
              id: data.alertId || `alert-${Date.now()}`,
              type: data.alertType,
              message: data.message,
              description: data.description,
              severity: data.severity || "medium",
              timestamp: new Date().toISOString(),
              acknowledged: false,
            };

            setPostureAlerts((prevAlerts) => {
              // 중복 알림 방지 (같은 ID의 알림이 있으면 업데이트)
              const existingAlertIndex = prevAlerts.findIndex(
                (alert) => alert.id === newAlert.id
              );
              if (existingAlertIndex >= 0) {
                const updatedAlerts = [...prevAlerts];
                updatedAlerts[existingAlertIndex] = newAlert;
                return updatedAlerts;
              }
              // 새 알림 추가
              return [newAlert, ...prevAlerts];
            });

            // 현재 표시할 알림 업데이트
            setCurrentAlert(newAlert);
          }
        } catch (error) {
          console.error(
            "메시지 처리 중 오류:",
            error,
            "원본 데이터:",
            event.data
          );
        }
      };

      // 연결 종료 이벤트 핸들러
      ws.current.onclose = (event) => {
        const closeInfo = {
          code: event.code,
          reason: event.reason || "알 수 없음",
          transport:
            ws.current && ws.current._transport
              ? ws.current._transport.transportName
              : "알 수 없음",
          wasClean: event.wasClean,
        };

        console.log("WebSocket 연결 종료:", closeInfo);
        console.log(
          "WebSocket 상태:",
          ws.current ? ws.current.readyState : "알 수 없음"
        );
        console.log(
          "WebSocket URL:",
          ws.current ? ws.current.url : "알 수 없음"
        );

        // 연결이 끊어지면 상태 초기화
        setIsConnected(false);
        setPostureData({
          isGoodPosture: true, // 서버 연결이 없을 때는 기본적으로 좋은 자세로 표시
          postureStatus: "Unknown",
          feedback: "",
          badPostureDuration: 0,
          recordedAt: null,
        });

        // 현재 알림도 초기화
        setCurrentAlert(null);

        // 자동 재연결 시도 (최대 5회까지)
        if (isActive && reconnectAttempts.current < 5) {
          const delay = Math.min(
            3000 * Math.pow(1.5, reconnectAttempts.current - 1),
            10000
          );
          console.log(`${delay / 1000}초 후 재연결 시도...`);
          reconnectTimeout.current = setTimeout(connectWebSocket, delay);
        } else if (reconnectAttempts.current >= 5) {
          setConnectionError(
            "최대 재연결 시도 횟수를 초과했습니다. 페이지를 새로고침하거나 나중에 다시 시도해주세요."
          );
          console.error("최대 재연결 시도 횟수 초과");
        }
      };

      // 에러 이벤트 핸들러
      ws.current.onerror = (error) => {
        console.error("WebSocket 오류 발생:", error);
        console.error(
          "WebSocket 상태:",
          ws.current ? ws.current.readyState : "알 수 없음"
        );
        console.error(
          "WebSocket URL:",
          ws.current ? ws.current.url : "알 수 없음"
        );

        const errorInfo = {
          message: error.message || "알 수 없는 오류",
          type: error.type,
          readyState: ws.current ? ws.current.readyState : "알 수 없음",
          transport:
            ws.current && ws.current._transport
              ? ws.current._transport.transportName
              : "알 수 없음",
        };

        console.error("WebSocket 오류 세부 정보:", errorInfo);
        setConnectionError(`WebSocket 연결 오류: ${errorInfo.message}`);
      };
    } catch (error) {
      console.error("WebSocket 연결 생성 중 오류:", error);
      console.error("오류 세부 정보:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      setConnectionError(`WebSocket 연결 생성 오류: ${error.message}`);

      if (isActive && reconnectAttempts.current < 5) {
        const delay = Math.min(
          3000 * Math.pow(1.5, reconnectAttempts.current - 1),
          10000
        );
        console.log(`연결 실패로 인한 재연결 시도... ${delay / 1000}초 후`);
        reconnectTimeout.current = setTimeout(connectWebSocket, delay);
      } else if (reconnectAttempts.current >= 5) {
        console.error("최대 재연결 시도 횟수 초과");
      }
    }
  };

  /**
   * 이미지 데이터 전송 함수
   * @param {string} imageData - Base64 인코딩된 이미지 데이터
   * WebSocket을 통해 서버로 이미지 데이터를 전송
   */
  const sendImageToWebSocket = (imageFile) => {
    if (!imageFile) {
      console.error("에러: 이미지 파일이 존재하지 않습니다.");
      return;
    }

    if (!(imageFile instanceof Blob)) {
      console.error("에러: imageFile이 Blob 타입이 아님", imageFile);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const base64Image = reader.result; // 'data:image/png;base64,...' 형식으로 변환됨
        // console.log("Base64 변환 성공:", base64Image.substring(0, 100));

      sendImageData(base64Image);
    };

    reader.onerror = (error) => {
      console.error("❌ FileReader 에러 발생:", error);
    };

    reader.readAsDataURL(imageFile);
  };

  // 🔹 WebSocket을 통해 이미지 데이터 전송
  const sendImageData = (imageData) => {
    if (!ws.current) {
      console.error("❌ WebSocket 인스턴스가 없습니다.");
      return;
    }

    if (typeof imageData !== "string") {
      console.error("❌ 에러: imageData가 Base64 문자열이 아님", imageData);
      return;
    }

    console.log("📤 WebSocket 전송 Base64 데이터 길이:", imageData.length);
    console.log(
      "📤 WebSocket 전송 Base64 데이터 앞 100자:",
      imageData.substring(0, 100)
    );

    // WebSocket.OPEN 상수 대신 숫자 1 사용 (SockJS와 호환성을 위해)
    if (!ws.current || ws.current.readyState !== 1) {
      console.error("❌ WebSocket 연결 상태 문제:", {
        readyState: ws.current ? ws.current.readyState : "알 수 없음",
        isConnected: isConnected,
      });
      return;
    }

    try {
      const message = JSON.stringify({
        type: "IMAGE",
        userId: userId,
        image: imageData, // MIME 타입 포함된 Base64 데이터
      });

      console.log("📤 WebSocket 최종 전송 데이터:", message);

      ws.current.send(message);
      console.log("✅ 이미지 데이터 전송 완료, userId:", userId);
    } catch (error) {
      console.error("❌ 이미지 전송 중 오류:", error);
      if (ws.current) {
        ws.current.close();
      }
    }
  };

  /**
   * WebSocket 연결 시작 함수
   * WebSocket 연결을 활성화하고 연결을 시작
   */
  const startWebSocket = () => {
    console.log("WebSocket 연결 시작...");
    reconnectAttempts.current = 0; // 시도 횟수 초기화

    // 연결 시작 시 상태 초기화
    setConnectionError(null);
    setPostureData({
      isGoodPosture: true, // 초기 상태는 좋은 자세로 설정
      postureStatus: "Unknown",
      feedback: "",
      badPostureDuration: 0,
      recordedAt: null,
    });
    setCurrentAlert(null);

    setIsActive(true); // 이 상태 변경이 useEffect를 트리거합니다
  };

  /**
   * WebSocket 연결 종료 함수
   * 모든 WebSocket 관련 리소스를 정리하고 연결을 종료
   */
  const stopWebSocket = () => {
    console.log("WebSocket 연결 종료 중...");
    setIsActive(false); // 이 상태 변경이 useEffect를 트리거합니다

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  };

  useEffect(() => {
    // console.log("useEffect 실행, isActive:", isActive);

    if (isActive) {
      // 약간의 지연 후 WebSocket 연결 시도
      const timer = setTimeout(() => {
        connectWebSocket();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (ws.current) {
          console.log("WebSocket 종료 중...");
          ws.current.onclose = null; // 이벤트 핸들러 제거
          ws.current.close();
          ws.current = null; // 안전하게 null 처리
        }
      };
    }
  }, [isActive]);

  /**
   * 알림 확인 처리 함수
   * @param {string} alertId - 확인할 알림의 ID
   */
  const acknowledgeAlert = (alertId) => {
    // 로컬 상태만 업데이트
    setPostureAlerts((prevAlerts) => {
      return prevAlerts.filter((alert) => alert.id !== alertId);
    });

    // 현재 알림 업데이트
    setCurrentAlert((prev) => {
      if (prev && prev.id === alertId) {
        // 다음 알림이 있으면 표시
        const nextAlert = postureAlerts.find((alert) => alert.id !== alertId);
        return nextAlert || null;
      }
      return prev;
    });

    console.log(`알림 ID ${alertId} 확인 처리 완료`);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionError,
        postureData,
        postureAlerts,
        currentAlert,
        sendImageData,
        startWebSocket,
        stopWebSocket,
        acknowledgeAlert,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
