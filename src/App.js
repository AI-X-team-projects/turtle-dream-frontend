import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import Login from "./pages/login/Login";
import theme from './theme/theme';

const RouterRoot = styled(Router)`
  & *,
  p {
    font-family: 'Noto Sans KR';
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
        <RouterRoot>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </RouterRoot>
    </ThemeProvider>
  );
}

export default App;
