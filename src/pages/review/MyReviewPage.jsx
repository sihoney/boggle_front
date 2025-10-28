import { useParams } from "react-router-dom";

import { reviews } from "@/assets/reviews.js";

export default function MyReviewPage() {
  const { nickname } = useParams();

  return (
    <div>
      <h1>{nickname}의 페이지</h1>
    </div>
  );
}
