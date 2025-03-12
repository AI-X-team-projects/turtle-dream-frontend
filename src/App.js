import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import Login from "./pages/login/Login";
import Header from './common/Header';
import theme from './theme/theme';
import ChartP from './pages/chart/ChartP';

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  & *,
  p {
    font-family: 'Noto Sans KR';
  }
`;

const ContentsBox = styled.div`
  width: 600px;
`;

function Layout({ children }) {
  return (
    <Root>
      <Header/>
      <ContentsBox>{children}</ContentsBox>
    </Root>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/ChartP" element={<ChartP />} />
            </Routes>
          </Layout>
        </Router>
    </ThemeProvider>
  );
}

export default App;
