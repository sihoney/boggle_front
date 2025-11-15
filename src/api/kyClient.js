import ky from "ky";

const API_BASE = "http://localhost:18080";

let accessToken = localStorage.getItem("access_token");
let refreshToken = localStorage.getItem("refresh_token");

const kyClient = ky.create({
  prefixUrl: API_BASE,
  timeout: 5000,

  headers: () => ({
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  }),

  hooks: {
    // beforeRequest: [
    //   (request) => {
    //     const token = localStorage.getItem("accessToken");
    //     if (token) {
    //       request.headers.set("Authorization", `Bearer ${token}`);
    //     }
    //   },
    // ],
    afterResponse: [
      async (request, options, response) => {
        // 401 Unauthorized 인증 실패
        //    (원인: 로그인 안 함, 토큰 없음/만료)
        //    (재시도: 가능)
        // 403 Forbidden 인가 실패
        //    (원인: 권한 부족)
        //    (재시도: 불가능)
        if (response.status === 401 || response.status === 403) {
          if (!refreshToken) {
            console.warn("No refresh token, please login again.");
            return response;
          }

          try {
            const refreshResponse = await ky.post(`${API_BASE}/auth/refresh`, {
              json: { refreshToken },
            });
            const data = await refreshResponse.json();

            // 1) 토큰 갱신
            accessToken = data.accessToken;
            refreshToken = data.refreshToken;

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            // 2) 원래 요청을 새 토큰으로 재시도 (Authorication 덮어쓰기)
            const retryOptions = {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            };

            return ky(request, retryOptions);
          } catch (err) {
            console.error("Refresh token expired. Please login again.");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return response;
          }
        }

        return response;
      },
    ],
  },
});

export default kyClient;
