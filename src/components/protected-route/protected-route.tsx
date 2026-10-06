import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/use-auth";

/**
 * Route guard component that restricts access to authenticated users.
 * Redirects unauthenticated visitors to the home page (`/`).
 */
export function ProtectedRoute() {
  const { loggedUser, loading } = useAuth();
  if (loading) return null;
  if (!loggedUser) return <Navigate to="/" replace />;
  return <Outlet />;
}