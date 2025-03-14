import axios from './axios';


export const postureApi = {
    // 일일 자세 데이터 조회
    getDailyPosture: async (userId, date) => {
        try {
            const response = await axios.get(`/api/posture/daily`, {
                params: { userId, date }
            });
            console.log("📡 서버 응답 (일일 자세 데이터): ", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ API 요청 실패 : ", error);
            throw error;
        }
    },

    // 월별 자세 데이터 조회
    getMonthlyPosture: async (userId, year, month) => {
        try {
            const response = await axios.get(`/api/posture/monthly`, {
                params: { userId, year, month }
            });
            console.log("📡 서버 응답 (월별 자세 데이터): ", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ API 요청 실패:", error);
            throw error;
        }
    },

    // AI 자세 분석 요청
    analyzePosture : async (userId, base64Image) => {
        try {
            console.log("전송할 userId:", userId);
            console.log("전송할 이미지 데이터:", base64Image.substring(0, 100)); // 데이터 일부만 출력
            const response = await fetch('http://localhost:8001/analyze-posture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    image: base64Image,
                }),
            });
            const data = await response.json();
            console.log("AI 서버 응답:", data);
        } catch (error) {
            console.error("AI 서버 요청 오류:", error);
        }
    },    
    

    // 자세 트렌드 조회
    getPostureTrends: async (userId, periodType) => {
        try {
            const response = await axios.get(`/api/posture/trends?userId=${userId}&periodType=${periodType}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 특정 알림 확인 처리(이 api는 추후 확장성을 고려해서 추가한 것 입니다. 당장 사용은 안해도 될 듯 합니다. -김동규-)
    acknowledgeAlert: async (alertId) => {
        try {
            await axios.post(`/api/posture/alerts/acknowledge/${alertId}`);
        } catch (error) {
            throw error;
        }
    },

    // 사용자 알림 조회(이 api는 추후 확장성을 고려해서 추가한 것 입니다. 당장 사용은 안해도 될 듯 합니다. -김동규-)
    getUserAlerts: async (userId) => {
        try {
            const response = await axios.get(`/api/posture/alerts?userId=${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 