import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/account";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c6a15b]">
            Client Portal
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            Sign In to Your Account
          </h1>
          <p className="mt-3 text-xs text-[#8e8a82]">
            Access your order history, delivery details, and exclusive decant releases.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-start gap-3 border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="mt-8 border border-white/10 bg-[#171715] p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@domain.com"
                  className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] font-medium">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-white/15 bg-[#11110f] pl-10 pr-10 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-3 text-[#8e8a82] hover:text-[#f4efe6] transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer shadow-lg mt-2"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-[#8e8a82]">
            New to The Decant Bar?{" "}
            <Link
              to="/register"
              className="text-[#c6a15b] font-medium hover:underline hover:text-[#d8c08a] transition"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#8e8a82]">
          <ShieldCheck size={14} className="text-[#c6a15b]" />
          <span>Encrypted Luxury Client Authentication</span>
        </div>
      </div>
    </Container>
  );
}
