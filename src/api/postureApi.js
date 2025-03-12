import axios from './axios';


export const postureApi = {
    // 일일 자세 데이터 조회
    getDailyPosture: async (date) => {
        try {
            const response = await axios.get(`/api/posture/daily?date=${date}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 월별 자세 데이터 조회
    getMonthlyPosture: async (year, month) => {
        try {
            const response = await axios.get(`/api/posture/monthly?year=${year}&month=${month}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 