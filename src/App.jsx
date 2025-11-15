import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalLayout from "@/layouts/GlobalLayout";
import MainPage from "@/pages/MainPage";
import Login from "@/pages/user/Login";
import Register from "@/pages/user/Register";
import MyPage from "@/pages/user/MyPage";

import PrivateRoute from "@/components/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  {
    path: "/users/me",
    element: (
      <PrivateRoute>
        <MyPage />
      </PrivateRoute>
    ),
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
