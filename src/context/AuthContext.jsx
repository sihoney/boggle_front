import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, refreshTokenApi, getMyInfo } from "@/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //   const [accessToken, setAccessToken] = useState(() =>
  //     localStorage.getItem("accessToken")
  //   );
  //   const [refreshToken, setRefreshToken] = useState(() =>
  //     localStorage.getItem("refreshToken")
  //   );
  const [user, setUser] = useState(null);
  //   const [loading, setLoading] = useState(true); // 초기 상태 로딩

  //   const isAuthenticated = !!accessToken;

  // 공통으로 토큰 세팅 함수
  //   const saveTokens = (access, refresh) => {
  //     setAccessToken(access);
  //     setRefreshToken(refresh);
  //     if (access) localStorage.setItem("accessToken", access);
  //     else localStorage.removeItem("accessToken");

  //     if (refresh) localStorage.setItem("refreshToken", refresh);
  //     else localStorage.removeItem("refreshToken");
  //   };

  // 앱 처음 로드 시: refresh token 있으면 자동 로그인 시도
  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initAuth() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    try {
      //   if (!refreshToken) {
      //     setLoading(false);
      //     return;
      //   }

      const res = await refreshTokenApi(refreshToken);

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      //   let currentAccess = accessToken;
      //   if (!currentAccess) {
      //     const res = await refreshTokenApi(refreshToken);
      //     currentAccess = res.accessToken;
      //     saveTokens(currentAccess, refreshToken);
      //   }

      const me = await getMyInfo();
      setUser(me);
    } catch (e) {
      console.error("초기 인증 복구 실패", e);
      //   saveTokens(null, null);
      setUser(null);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  // 로그인 함수 (Login 페이지에서 사용)
  const login = async (email, password) => {
    const res = await loginApi(email, password);
    const { accessToken, refreshToken } = res;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // saveTokens(at, rt);

    const me = await getMyInfo();
    setUser(me);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // saveTokens(null, null);
    setUser(null);
  };

  const value = {
    user,
    // accessToken,
    // refreshToken,
    // isAuthenticated,
    // loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
