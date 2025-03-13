// 로그아웃시 카메라가 꺼지도록 간단한 이벤트 버스 구현
const eventBus = {
  events: {},

  // 이벤트 구독
  subscribe: function (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // 구독 취소 함수 반환
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  },

  // 이벤트 발행
  publish: function (event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(data);
      });
    }
  },
};

export default eventBus;
