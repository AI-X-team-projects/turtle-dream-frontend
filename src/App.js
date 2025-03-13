import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import Login from "./pages/login/Login";
import Header from "./common/Header";
import theme from "./theme/theme";
import ChartP from "./pages/chart/ChartP";
import SingUp from "./pages/signup/SignUp";
import Main from "./pages/main/Main";
import Analysis from "./pages/analyze/Analysis";
import { WebSocketProvider } from "./common/WebSocketProvider";
import { userApi } from "./api/userApi";

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  & *,
  p {
    font-family: "Noto Sans";
  }
`;

const ContentsBox = styled.div`
  
`;

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = userApi.checkLoginStatus();
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function Layout({ children }) {
  return (
    <Root>
      <Header />
      <ContentsBox>{children}</ContentsBox>
    </Root>
  );
}

function App() {
  const [userId, setUserId] = useState("defaultUser"); // 실제로는 로그인 시 설정되어야 함

  return (
    <ThemeProvider theme={theme}>
      <WebSocketProvider userId={userId}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Login setUserId={setUserId} />} />
              <Route path="/signup" element={<SingUp />} />
              <Route
                path="/main"
                element={
                  <ProtectedRoute>
                    <Main />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ChartP"
                element={
                  <ProtectedRoute>
                    <ChartP />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
