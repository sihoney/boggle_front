import { useAuth } from "@/context/AuthContext";
import { getMyInfo } from "@/api/auth";

function MyPage() {
  const { user: me } = useAuth();

  const handleMe = async () => {
    try {
      const res = await getMyInfo();
      console.log("User info: ", res);
    } catch(error) {
      console.log("Failed to fetch user info: ", error);
    }

  };

  if (!me) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h2>내 정보</h2>
        <p>Email: {me.email}</p>
        <p>Role: {me.role}</p>
      </div>
      <div>
        <button onClick={handleMe}>/users/me 요청</button>
      </div>
    </div>
  );
}

export default MyPage;
