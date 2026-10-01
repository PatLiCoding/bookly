import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/use-auth";

export function ProtectedRoute() {
  const { loggedUser } = useAuth();

  if (!loggedUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}