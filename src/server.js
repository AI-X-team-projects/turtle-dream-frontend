const express = require('express');
const cors = require('cors');

const app = express();

// CORS 설정 추가
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON 요청 처리
app.use(express.json());

// 샘플 API 엔드포인트
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS 설정 완료! 프론트엔드에서 요청 가능!' });
});

// 서버 실행
const PORT = 8001; // Node.js 백엔드 포트
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
