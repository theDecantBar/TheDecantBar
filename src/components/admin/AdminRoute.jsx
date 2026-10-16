import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#11110f] flex flex-col items-center justify-center text-[#f4efe6]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-4" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace state={{ from: "admin" }} />;
  }

  return <Outlet />;
}
