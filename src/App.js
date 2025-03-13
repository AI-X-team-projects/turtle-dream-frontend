import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
              <Route path="/ChartP" element={<ChartP />} />
              <Route path="/signup" element={<SingUp />} />
              <Route path="/main" element={<Main />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </Layout>
        </Router>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
