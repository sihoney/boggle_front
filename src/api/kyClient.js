import ky from "ky";

const API_BASE = "http://localhost:18080";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

const kyClient = ky.create({
  prefixUrl: API_BASE,
  timeout: 5000,

  // headers: () => ({
  //   Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
  // }),

  hooks: {
    beforeRequest: [
      (request) => {
        accessToken = localStorage.getItem("accessToken");
        // const accessToken = localStorage.getItem("accessToken");

        // console.log("authorization: Bearer ", accessToken);
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        console.log(response.url);
        console.log(response.status);

        if (response.status === 401) {
          // 인증 실패 (로그인 실패, 토큰 없음, 토큰 유효X)
          let errorData;

          // 1) 에러 응답 파싱
          try {
            errorData = await response.json();
          } catch (e) {
            console.error("에러 응답 파싱 실패");
            window.location.href = "/auth/login";
            return;
          }

          // 2) TOKEN_EXPIRED인 경우에만 Refresh Flow
          if (errorData.code === "TOKEN_EXPIRED") {
            return await handleTokenRefresh();
          }

          // 3) 그 외 모든 경우: 로그아웃
          handleLogout();
        }

        return response;
      },
    ],
  },
});

async function handleTokenRefresh(originalRequest) {
  refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.warn("No refresh token, please login again.");
    handleLogout();
    // return response;
  }

  try {
    const { accessToken: at, refreshToken: rt } = await ky
      .post(`${API_BASE}/auth/refresh`, {
        json: { refreshToken },
      })
      .json();
    // const data = await refreshResponse.json();

    // // 2-1) 토큰 갱신
    // const newAccessToken = data.accessToken;
    // const newRefreshToken = data.refreshToken;

    localStorage.setItem("accessToken", at);
    localStorage.setItem("refreshToken", rt);

    // 2-2) 새 access token으로 재요청 (Authorization 덮어쓰기)
    originalRequest.headers.set("Authorization", `Bearer ${at}`);

    return ky(originalRequest);
    // const retryOptions = {
    //   ...options,
    //   headers: {
    //     ...options.headers,
    //     Authorization: `Bearer ${newAccessToken}`,
    //   },
    // };
    // return ky(request, retryOptions);
  } catch (err) {
    handleLogout();
    throw err; // 여기서 왜 에러를 던지지?
    // console.error("Refresh token expired. Please login again.");
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    // return response;
  } finally {
    console.log("자동 refresh token 완료");
  }
}

function handleLogout() {
  // 3/3) 다른 에러 코드들: 즉시 로그아웃
  localStorage.clear();
  window.location.href = "/auth/login";
  // else if (errorCode === "TOKEN_MISSING") {
  //   console.log("❌ 토큰 없음 → 로그인 페이지");
  //   window.location.href = "/auth/login";
  // } else if (
  //   errorCode === "TOKEN_INVALID" ||
  //   errorCode === "TOKEN_MALFORMED" ||
  //   errorCode === "TOKEN_INVALID_TYPE"
  // ) {
  //   console.log("❌ 유효하지 않은 토큰 → 로그아웃");
  //   localStorage.clear();
  //   window.location.href = "/auth/login";
  // } else {
  //   console.log("❌ 알 수 없는 인증 오류 → 로그아웃");
  //   localStorage.clear();
  //   window.location.href = "/auth/login";
  // }
}

export default kyClient;
