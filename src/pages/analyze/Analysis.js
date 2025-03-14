import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import CommonRoot from "../../common/CommonRoot";
import { ReactComponent as VideoImage } from "../../assets/images/VideoImage.svg";
import { ReactComponent as ArrowIcon } from "../../assets/images/ArrowIcon.svg";
import CommonButton from "../../common/CommonButton";
import { useWebSocket } from "../../common/WebSocketProvider";
import { useNavigate } from "react-router-dom";
import eventBus from "../../utils/eventBus";

const TitleStyle = styled.p`
  margin: 0;
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.color.black};
  font-weight: 800;
  text-align: center;
  margin-bottom: 24px;
`;

const VideoBoxStyle = styled.div`
  width: 600px;
  height: 401px;
  border-radius: 8px;
  border: 1px dashed #d4d4d4;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #000;
  position: relative;
`;

const DropdownContainer = styled.div`
  width: 500px;
  position: relative;
  margin-bottom: 20px;
`;

const SelectBox = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.color.grey};
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
`;

const OptionsList = styled.ul.attrs(() => ({ role: "list" }))`
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: 100%;
  background: ${(props) => props.theme.color.white};
  border: 1px solid #ccc;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const OptionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  transform: scaleX(-1);
`;

const BackText = styled.button`
  margin: 8px 0 0;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.black};
  font-weight: 800;
  cursor: pointer;
  background: transparent;
  border: 0px;
  text-align: center;
`;

// 연결 상태 표시 컴포넌트
const ConnectionStatus = styled.div`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSize.sm};
  text-align: center;
  background-color: ${(props) =>
    props.$isConnected
      ? props.theme.color.green
      : props.$hasError
      ? props.theme.color.red
      : props.theme.color.grey};
  color: white;
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  font-size: ${(props) => props.theme.fontSize.sm};
  text-align: center;
  background-color: ${(props) => props.theme.color.red};
  color: white;
`;

const Analysis = () => {
  const [start, setStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [cameras, setCameras] = useState([]);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const {
    startWebSocket,
    stopWebSocket,
    sendImageData,
    isConnected,
    connectionError,
  } = useWebSocket();

  // 카메라 종료 함수
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    stopWebSocket();
    setStart(false);
  };

  // 창 닫기 방지 기능 추가
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (start) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [start]);

  // 로그아웃 이벤트 구독
  useEffect(() => {
    const unsubscribe = eventBus.subscribe("STOP_CAMERA", () => {
      console.log("카메라 종료 이벤트 수신");
      stopCamera();
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
    };
  }, [stream]);

  // 컴포넌트 언마운트 시 카메라 종료
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const getCameras = async () => {
      try {
        // 카메라 목록만 가져오고 실제로 카메라는 켜지 않도록 수정
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setCameras(videoDevices);

        if (videoDevices.length > 0) {
          setSelected(videoDevices[0].label || "기본 카메라");
        }
      } catch (error) {
        console.error("카메라 목록을 가져오는 중 오류:", error);
        setCameras([]);
        setSelected("카메라를 찾을 수 없습니다");
      }
    };

    getCameras();
  }, []);

  const handleSelect = (camera) => {
    setSelected(camera.label || "알 수 없는 카메라");
    setIsOpen(false);
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => {
        console.error("비디오 재생 중 오류:", error);
      });
    }
  }, [stream]);

  const handleClickButton = async () => {
    if (!start) {
      try {
        // 기존 스트림이 있다면 정리
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        // 선택된 카메라 찾기
        const selectedDevice = cameras.find(
          (camera) => (camera.label || "알 수 없는 카메라") === selected
        );

        // 카메라 접근 설정
        const constraints = {
          video: selectedDevice
            ? {
                deviceId: { exact: selectedDevice.deviceId },
                width: { ideal: 500 },
                height: { ideal: 281 },
                frameRate: { ideal: 30 }
              }
            : {
                width: { ideal: 500 },
                height: { ideal: 281 },
                frameRate: { ideal: 30 }
              },
          audio: false
        };

        console.log("선택된 카메라:", selected);
        console.log("카메라 접근 시도...");
        
        // 먼저 기존 미디어 장치 열거
        await navigator.mediaDevices.enumerateDevices();
        
        // 카메라 접근 시도
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // 스트림의 트랙 정보 확인
        const videoTrack = mediaStream.getVideoTracks()[0];
        if (videoTrack) {
          console.log("비디오 트랙 획득 성공:", videoTrack.label);
          console.log("트랙 설정:", videoTrack.getSettings());
        }

        // 스트림 설정
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }

        // WebSocket 연결 시작
        startWebSocket();
        setStart(true);
      } catch (error) {
        console.error("카메라 접근 오류 상세:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        let errorMessage = "카메라 접근 오류가 발생했습니다.\n";
        
        switch(error.name) {
          case "NotReadableError":
            errorMessage += "카메라가 다른 앱에서 사용 중입니다.\n";
            errorMessage += "1. 작업 관리자를 열어 카메라를 사용 중인 프로세스를 확인하고 종료해주세요.\n";
            errorMessage += "2. 컴퓨터를 재시작해주세요.";
            break;
          case "NotAllowedError":
            errorMessage += "카메라 접근 권한이 거부되었습니다.\n";
            errorMessage += "1. 브라우저 설정 → 개인정보 및 보안 → 카메라에서 권한을 허용해주세요.\n";
            errorMessage += "2. Windows 설정 → 개인정보 → 카메라에서 권한을 확인해주세요.";
            break;
          case "NotFoundError":
            errorMessage += "카메라를 찾을 수 없습니다.\n";
            errorMessage += "1. 장치 관리자에서 카메라가 정상적으로 인식되는지 확인해주세요.\n";
            errorMessage += "2. 카메라 드라이버를 재설치해보세요.";
            break;
          default:
            errorMessage += `오류: ${error.message}\n`;
            errorMessage += "1. 브라우저를 완전히 종료 후 재시작해보세요.\n";
            errorMessage += "2. 다른 브라우저(예: Edge, Firefox)로 시도해보세요.";
        }
        
        alert(errorMessage);
        
        // 에러 발생 시 상태 초기화
        setStream(null);
        setStart(false);
      }
    } else {
      stopCamera();
    }
  };


  //1초마다 실행되는 이미지 캡쳐 및 전송 로직
  useEffect(() => {
    if (!start || !stream || !isConnected) return;

    console.log("WebSocket 상태:", isConnected ? "연결됨" : "연결되지 않음");

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 281;

    const interval = setInterval(() => {
      if (videoRef.current && isConnected) {
        try {
          //1.비디오 프레임을 캔버스에 그리기
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );

          //2.캔버스의 이미지를 Blob으로 변환
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
                reader.onloadend = () => {
                //3.Blob을 Base64로 변환
                const base64data = reader.result.split(",")[1];
                if (isConnected) {
                  console.log("이미지 변환 완료:", {
                    originalSize: blob.size,
                    base64Size: base64data.length,
                    timestamp: new Date().toISOString()
                  });
                  sendImageData(base64data);
                }
              };
              reader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.95
          );
        } catch (error) {
          console.error("이미지 캡처 중 오류:", error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [start, stream, sendImageData, isConnected]);

  // 여기까지가카메라 이미지를 base64로 변환하고 websocket 서버로 전송하는 로직


  
  const goToMain = () => {
    // 메인으로 이동 시 카메라 종료
    stopCamera();
    navigate("/main");
  };

  return (
    <CommonRoot>
      <TitleStyle>자세 측정</TitleStyle>
      <VideoBoxStyle>
        {start ? (
          <Video ref={videoRef} autoPlay playsInline muted />
        ) : (
          <VideoImage />
        )}
      </VideoBoxStyle>

      {start && (
        <ConnectionStatus
          $isConnected={isConnected}
          $hasError={!!connectionError}
        >
          {isConnected
            ? "서버에 연결됨"
            : connectionError
            ? "연결 오류"
            : "서버에 연결 중..."}
        </ConnectionStatus>
      )}

      {start && connectionError && (
        <ErrorMessage>{connectionError}</ErrorMessage>
      )}

      <DropdownContainer>
        <SelectBox onClick={() => setIsOpen(!isOpen)}>
          {selected}{" "}
          <span>
            <ArrowIcon />
          </span>
        </SelectBox>
        <OptionsList $isOpen={isOpen}>
          {cameras.map((camera, index) => (
            <OptionItem
              key={camera.deviceId}
              onClick={() => handleSelect(camera)}
            >
              {camera.label || `카메라 ${index + 1}`}
            </OptionItem>
          ))}
        </OptionsList>
      </DropdownContainer>
      <CommonButton
        background={start ? true : false}
        width={"500px"}
        children={start ? "측정 중지" : "측정 시작"}
        onClick={handleClickButton}
      />
      <BackText onClick={goToMain}>메인으로 이동</BackText>
    </CommonRoot>
  );
};

export default Analysis;
