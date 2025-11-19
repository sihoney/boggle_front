import ky from "ky";

const API_BASE = "http://localhost:18080";

let isRefreshing = false;
let refreshPromise = null;

// let accessToken = localStorage.getItem("accessToken");
// let refreshToken = localStorage.getItem("refreshToken");

function handleLogout() {
  localStorage.clear();
  // window.location.href = "/auth/login";
}

async function refreshAccessToken() {
  // 이미 갱신 중이면 같은 Promise 반환 (중복 방지)
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  
  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("No refresh token, please login again.");
        // handleLogout();
        // throw new Error("No refresh token");
        // return response;
      }

      const { accessToken: at, refreshToken: rt } = await ky
        .post(`${API_BASE}/auth/refresh`, {
          json: { refreshToken },
        })
        .json();
        
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);

      console.log("✅ Token refreshed successfully");
      return at;
    } catch(err) {
      console.error("❌ Token refresh failed:", err);
      handleLogout();
      throw err; // 여기서 왜 에러를 던지지?      
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const kyClient = ky.create({
  prefixUrl: API_BASE,
  timeout: 5000,
  retry: {
    limit: 0,
  },

  // headers: () => ({
  //   Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  // }),

  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = localStorage.getItem("accessToken");
        // const accessToken = localStorage.getItem("accessToken");

        // console.log("authorization: Bearer ", accessToken);
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {

        if (response.status !== 401) {
          return response;
        }

          
          let errorData;

          // 1) 에러 응답 파싱
          try {
            // ✅ clone()을 사용해서 원본 response를 보존
            errorData = await response.clone().json();
          } catch (e) {
            console.error("에러 응답 파싱 실패");
            // window.location.href = "/auth/login";
            handleLogout();
            return response;
          }

          console.log("🔴 401 Error:", errorData);
          // const errorData = await response.clone().json();
          
          // 2) TOKEN_EXPIRED인 경우에만 Refresh Flow
          if (errorData.code === "TOKEN_EXPIRED") {
            try {
              // 토큰 갱신
              const newAccessToken = await refreshAccessToken();
              // console.log("TOKEN_EXPIRED -> handleTokenRefresh")
              // return await handleTokenRefresh(request);

              // 원래 요청 재시도
              let path = request.url.replace(API_BASE, '');

              // 앞의 슬래시 제거
              if (path.startsWith('/')) {
                path = path.slice(1); // "api/users/me"
              }       

              return kyClient(path, {
                method: options.method || request.method,
                json: options.json,
                searchParams: options.searchParams,
              });
              // // ✅ 기존 헤더 복사 후 Authorization 업데이트
              // const headers = new Headers(request.headers);
              // headers.set("Authorization", `Bearer ${newAccessToken}`);
              // // ✅ fetch 직접 사용 (URL 중복 없음)
              // const retryResponse = await fetch(request.url, {
              //   method: request.method,
              //   headers: headers,
              //   body: request.method !== 'GET' && request.method !== 'HEAD' 
              //     ? await request.clone().text() 
              //     : undefined,
              // });
              // return retryResponse;

              // return ky(request.url, {
              //   ...options,
              //   headers: {
              //     ...options.headers,
              //     Authorization: `Bearer ${newAccessToken}`,
              //   },
              // });
            } catch(error) {
              // Refresh 실패 시 로그아웃
              handleLogout();
              throw error;
            }
          } 
          // 다른 401 에러
          console.log("❌ Auth failed:", errorData.code);
          handleLogout();
          throw new Error(`Authentication failed: ${errorData.code}`);          
          // else {
          //   // 3) 그 외 모든 경우: 로그아웃
          //   handleLogout();
          //   throw new Error("Authentication failed")
          // }        
      },
    ],
  },
});

export default kyClient;
