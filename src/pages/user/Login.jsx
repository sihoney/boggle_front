import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await loginApi(email, password);

      // 서버 응답: { token: "..." }
      localStorage.setItem("token", res.token);

      alert("로그인 성공!");

      nav("/users/me");
    } catch (err) {
      alert("로그인 실패");
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
