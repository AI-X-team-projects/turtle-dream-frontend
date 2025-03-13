import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import CommonRoot from "../../common/CommonRoot";
import { ReactComponent as VideoImage } from "../../assets/images/VideoImage.svg";
import { ReactComponent as ArrowIcon } from "../../assets/images/ArrowIcon.svg";
import CommonButton from "../../common/CommonButton";
import { useWebSocket } from "../../common/WebSocketProvider";

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

const Analysis = () => {
  const [start, setStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [cameras, setCameras] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const { startWebSocket, stopWebSocket, sendImageData, isConnected } =
    useWebSocket();

  useEffect(() => {
    const getCameras = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });

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
        const selectedDevice = cameras.find(
          (camera) => (camera.label || "알 수 없는 카메라") === selected
        );

        const constraints = {
          video: selectedDevice
            ? {
                deviceId: { exact: selectedDevice.deviceId },
                width: { ideal: 500 },
                height: { ideal: 281 },
              }
            : {
                width: { ideal: 500 },
                height: { ideal: 281 },
              },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        setStream(mediaStream);

        // WebSocket 연결 시작
        startWebSocket();
        setStart(true);
      } catch (error) {
        console.error("카메라 접근 오류:", error);
      }
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      stopWebSocket();
      setStart(false);
    }
  };

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
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result.split(",")[1];
                if (isConnected) {
                  sendImageData(base64data);
                }
              };
              reader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.8
          );
        } catch (error) {
          console.error("이미지 캡처 중 오류:", error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [start, stream, sendImageData, isConnected]);

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
    </CommonRoot>
  );
};

export default Analysis;
