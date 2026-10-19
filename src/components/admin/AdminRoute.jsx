import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LuxuryLoader from "../common/LuxuryLoader";

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LuxuryLoader show={true} message="Verifying Admin Credentials..." />;
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace state={{ from: "admin" }} />;
  }

  return <Outlet />;
}
