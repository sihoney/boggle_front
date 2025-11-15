import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
  // const token = localStorage.getItem("token");
  // return token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
