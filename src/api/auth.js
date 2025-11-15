import kyClient from "./kyClient";

export async function loginApi(email, password) {
  return kyClient.post("auth/login", { json: { email, password } }).json(); // { accessToken, refreshToken }
}

export async function registerApi(email, password) {
  return kyClient.post("auth/register", { json: { email, password } }).json();
}

export async function refreshTokenApi(refreshToken) {
  return kyClient.post("auth/refresh", { json: { refreshToken } }).json(); // { accessToken }
}

export async function getMyInfo() {
  return kyClient.get("users/me").json();
}
