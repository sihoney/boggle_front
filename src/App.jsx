import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalLayout from "@/layouts/GlobalLayout";
import MainPage from "@/pages/MainPage";
import MyReviewPage from "@/pages/review/MyReviewPage";

export const router = createBrowserRouter([
  { path: "/boggle", element: <MainPage /> },
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      // ✅ 메인 페이지
      { path: "my/reviews/:nickname", element: <MyReviewPage /> },

      // // ✅ 사용자(User)
      // { path: "login", element: <LoginPage /> },
      // { path: "register", element: <RegisterPage /> },
      // { path: "profile/edit", element: <ProfileEditPage /> },

      // // ✅ 리뷰(Review)
      // { path: "my/reviews/:nickname", element: <MyReviewsPage /> },
      // { path: "reviews/new", element: <ReviewWritePage /> },
      // { path: "reviews/edit/:reviewId", element: <ReviewWritePage /> },
      // { path: "reviews/:reviewId", element: <ReviewDetailPage /> },

      // // ✅ 도서(Book)
      // { path: "books/:isbn", element: <BookDetailPage /> },
      // { path: "taste", element: <TastePage /> },

      // // ✅ 플레이리스트(Playlist)
      // { path: "my/playlists/:nickname", element: <PlaylistPage /> },
      // { path: "playlists/:playlistId", element: <PlaylistDetailPage /> },

      // // ✅ 감정 분석
      // { path: "analyze/:nickname", element: <AnalyzePage /> },

      // // ✅ 결과 페이지
      // { path: "success", element: <SuccessPage /> },
      // { path: "failure", element: <FailurePage /> },

      // // ✅ Not Found
      // { path: "*", element: <FailurePage /> },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
