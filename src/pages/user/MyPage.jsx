import { useEffect, useState } from "react";
import { getMyInfo } from "@/api/auth";

function MyPage() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await getMyInfo();
        setMe(res);
      } catch (err) {
        console.error("불러오기 실패", err);
      }
    }
    fetchMe();
  }, []);

  if (!me) return <div>Loading...</div>;

  return (
    <div>
      <h2>내 정보</h2>
      <p>Email: {me.email}</p>
      <p>Role: {me.role}</p>
    </div>
  );
}

export default MyPage;
