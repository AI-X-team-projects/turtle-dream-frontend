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
  const [postureData, setPostureData] = useState({
    // 자세 데이터 상태
    isGoodPosture: false,
    postureStatus: "Unknown",
    feedback: "",
  });

  // refs
  const ws = useRef(null); // WebSocket 인스턴스 참조
  const reconnectTimeout = useRef(null); // 재연결 타이머 참조

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
        ws.current.close();
        ws.current = null;
      }

      // 재연결 타이머 정리
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      console.log("WebSocket 연결 시도...");

      // SockJS 인스턴스 생성 및 연결
      const sockjs = new SockJS("http://localhost:8080/ws/posture", null, {
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
        debug: true,
      });
      console.log("SockJS 인스턴스 생성됨:", sockjs);

      ws.current = sockjs;

      // 연결 성공 이벤트 핸들러
      ws.current.onopen = () => {
        console.log("WebSocket 연결 성공!");
        setIsConnected(true);
      };

      // 메시지 수신 이벤트 핸들러
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.error("서버 에러:", data.error);
            return;
          }
          console.log("서버로부터 받은 데이터:", data);
          setPostureData({
            isGoodPosture: data.isGoodPosture,
            postureStatus: data.postureStatus,
            feedback: data.feedback,
          });
        } catch (error) {
          console.error("메시지 처리 중 오류:", error);
        }
      };

      // 연결 종료 이벤트 핸들러
      ws.current.onclose = (event) => {
        console.log(
          `WebSocket 연결 종료 - 코드: ${event.code}, 이유: ${
            event.reason || "알 수 없음"
          }, 프로토콜: ${
            ws.current._transport
              ? ws.current._transport.transportName
              : "알 수 없음"
          }`
        );
        setIsConnected(false);

        // 자동 재연결 시도
        if (isActive) {
          console.log("3초 후 재연결 시도...");
          reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
        }
      };

      // 에러 이벤트 핸들러
      ws.current.onerror = (error) => {
        console.error("WebSocket 오류 발생:", error);
        if (ws.current) {
          console.log("현재 WebSocket 상태:", ws.current.readyState);
          console.log(
            "현재 전송 프로토콜:",
            ws.current._transport
              ? ws.current._transport.transportName
              : "알 수 없음"
          );
        }
      };
    } catch (error) {
      console.error("WebSocket 연결 생성 중 오류:", error);
      if (isActive) {
        console.log("연결 실패로 인한 재연결 시도...");
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      }
    }
  };

  /**
   * 이미지 데이터 전송 함수
   * @param {string} imageData - Base64 인코딩된 이미지 데이터
   * WebSocket을 통해 서버로 이미지 데이터를 전송
   */
  const sendImageData = (imageData) => {
    if (!ws.current) {
      console.error("WebSocket 인스턴스가 없습니다.");
      return;
    }

    if (ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket 연결 상태:", {
        readyState: ws.current.readyState,
        isConnected: isConnected,
      });
      return;
    }

    try {
      const message = JSON.stringify({
        userId: userId,
        imageData: imageData,
      });
      ws.current.send(message);
      console.log("이미지 데이터 전송 완료");
    } catch (error) {
      console.error("이미지 전송 중 오류:", error);
      ws.current.close();
    }
  };

  /**
   * WebSocket 연결 시작 함수
   * WebSocket 연결을 활성화하고 연결을 시작
   */
  const startWebSocket = () => {
    console.log("WebSocket 연결 시작...");
    setIsActive(true);
    connectWebSocket();
  };

  /**
   * WebSocket 연결 종료 함수
   * 모든 WebSocket 관련 리소스를 정리하고 연결을 종료
   */
  const stopWebSocket = () => {
    console.log("WebSocket 연결 종료 중...");
    setIsActive(false);

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setPostureData({
      isGoodPosture: false,
      postureStatus: "Unknown",
      feedback: "",
    });
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopWebSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        postureData,
        sendImageData,
        startWebSocket,
        stopWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
