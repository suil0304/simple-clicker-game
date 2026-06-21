// 백엔드 API와 소통하기 위해 정의.
// 브라우저 내장인 fetch보다 편리한 기능이 다수 탑재되어 있기에 사용하였습니다.
import axios from "axios";

// 생성, baseURL은 VITE_API_URL, 5초 동안 응답 없을 시 타임 아웃.
const client = axios.create({
    baseURL: import.meta.env["VITE_API_URL"]!,
    timeout: 5000 // millisecond
});

// interceptor는 말 그대로 요청 중간에 끼어 들어 작동하는 것입니다.
// 여기에서는 요청 중간에 끼어 들어 Bearer Token으로 JWT을 보냅니다.
// JWT이란 JSON Web Token의 줄임입니다. JSON을 서버의 비밀 키로 서명해 암호화하여 사용하는 토큰입니다.
// JWT sub(subject, 여기에서는 id를 담음)와 같은 것이 표준 규격으로 사용되나 여기에서는 sub: id로만 사용하였습니다.
client.interceptors.request.use(
    (config) => {
        // JWT을 꺼내,
        const jwtToken = window.localStorage.getItem("jwt");

        if(jwtToken && config.headers) {
            // Authorization에 Bearer Token 형태로 담고,
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }

        // 변형된 요청을 다시 전송.
        return config;
    },
    (error) => {
        // 에러 => 반환.
        return Promise.reject(error);
    }
);

export default client;