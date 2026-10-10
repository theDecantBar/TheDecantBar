import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../ui/Container";

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Container className="py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
          Authenticating Administrator...
        </p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-md text-center border border-red-500/20 bg-[#171715] p-8 sm:p-12 shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-950/20 text-red-400">
            <ShieldAlert size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-red-400">
            Access Restricted
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            Administrator Only
          </h1>
          <p className="mt-4 text-xs text-[#8e8a82] leading-relaxed">
            Your current account does not have permission to view the executive control panel.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 border border-white/15 bg-transparent px-6 py-3 text-xs uppercase tracking-wider text-[#f4efe6] hover:bg-white/5 transition"
            >
              <ArrowLeft size={14} /> Return to Client Portal
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return children;
}
