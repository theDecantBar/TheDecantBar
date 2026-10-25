import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  X,
} from "lucide-react";
import Container from "../components/ui/Container";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import { useAuth } from "../context/AuthContext";
import { sendForgotPasswordOtpApi, resetPasswordOtpApi } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: emailParam,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotCooldown, setForgotCooldown] = useState(0);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const from =
    location.state?.from?.pathname ||
    (typeof location.state?.from === "string" ? location.state.from : null) ||
    searchParams.get("redirect") ||
    "/account";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // 60-second cooldown timer for forgot password
  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const timer = setInterval(() => {
      setForgotCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotCooldown]);

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

  // Forgot Password: Send OTP
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    setForgotSubmitting(true);
    try {
      const res = await sendForgotPasswordOtpApi(forgotEmail.trim());
      setForgotStep(2);
      setForgotCooldown(30);
      setForgotSuccess(res.message || "Verification code sent to your email address.");
    } catch (err) {
      setForgotError(err.message || "Unable to send the verification code. Please try again.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  // Forgot Password: Resend OTP
  const handleResendForgotOtp = async () => {
    if (forgotCooldown > 0 || forgotSubmitting) return;
    setForgotError("");
    setForgotSuccess("");
    setForgotSubmitting(true);
    try {
      const res = await sendForgotPasswordOtpApi(forgotEmail.trim());
      setForgotCooldown(30);
      setForgotSuccess(res.message || "Verification code sent to your email address.");
    } catch (err) {
      setForgotError(err.message || "Unable to send the verification code. Please try again.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  // Forgot Password: Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setForgotError("Please enter the 6-digit code.");
      return;
    }

    if (newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotSubmitting(true);
    try {
      await resetPasswordOtpApi({
        email: forgotEmail.trim(),
        otpCode: forgotOtp.trim(),
        newPassword,
      });

      setForgotSuccess("Password reset successfully! You can now sign in.");
      setFormData((prev) => ({ ...prev, email: forgotEmail }));
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotStep(1);
        setForgotOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setForgotSuccess("");
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setForgotSubmitting(false);
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
          <div className="mt-6 border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {error.includes("create an account") && (
              <div className="mt-3 pl-7">
                <Link
                  to={`/register?email=${encodeURIComponent(formData.email)}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#c6a15b] underline hover:text-[#d8c08a] transition"
                >
                  Create an account now &rarr;
                </Link>
              </div>
            )}
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
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(formData.email);
                    setForgotStep(1);
                    setForgotError("");
                    setForgotSuccess("");
                    setForgotModalOpen(true);
                  }}
                  className="text-[11px] text-[#c6a15b] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
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
                  className="absolute right-3.5 top-3 text-[#8e8a82] hover:text-[#f4efe6] transition cursor-pointer"
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

            {/* Google Authentication */}
            <GoogleAuthButton
              mode="login"
              from={from}
              onError={(msg) => setError(msg)}
            />
          </form>

          {/* Switch to Register */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-[#8e8a82]">
            New to The Decant Bar?{" "}
            <Link
              to={from && from !== "/account" ? `/register?redirect=${encodeURIComponent(from)}` : "/register"}
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

      {/* Forgot Password OTP Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md border border-[#c6a15b]/40 bg-[#151512] shadow-2xl p-6 sm:p-7 relative rounded-lg">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="absolute top-4 right-4 text-[#8e8a82] hover:text-[#f4efe6] cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-full bg-[#c6a15b]/10 text-[#c6a15b] border border-[#c6a15b]/30">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#f4efe6]">
                  {forgotStep === 1 ? "Reset Your Password" : "Enter Verification Code"}
                </h3>
                <p className="text-xs text-[#8e8a82]">
                  {forgotStep === 1
                    ? "Enter your registered email to receive a 6-digit reset code."
                    : `We sent a reset code to ${forgotEmail}.`}
                </p>
              </div>
            </div>

            {forgotError && (
              <div className="mb-4 border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 border border-white/15 text-xs text-[#c5c1b9] hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="flex items-center gap-2 px-5 py-2 border border-[#c6a15b] bg-[#c6a15b] text-[#11110f] text-xs font-semibold uppercase tracking-wider hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer"
                  >
                    <span>{forgotSubmitting ? "Sending Code..." : "Send Reset Code"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full border border-[#c6a15b] bg-[#11110f] py-2.5 text-center text-xl font-mono tracking-[0.4em] text-[#f4efe6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full border border-white/15 bg-[#11110f] px-3.5 py-2.5 pr-10 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-[#8e8a82] hover:text-[#f4efe6]"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full border border-white/15 bg-[#11110f] px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-[#8e8a82] hover:text-[#f4efe6]"
                  >
                    &larr; Back
                  </button>

                  <button
                    type="button"
                    disabled={forgotCooldown > 0 || forgotSubmitting}
                    onClick={handleResendForgotOtp}
                    className="inline-flex items-center gap-1 text-[#c6a15b] hover:text-[#d8c08a] disabled:opacity-40"
                  >
                    <RotateCcw size={12} />
                    {forgotCooldown > 0 ? `Resend in ${forgotCooldown}s` : "Resend Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={forgotSubmitting || forgotOtp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer shadow-lg mt-2"
                >
                  <span>{forgotSubmitting ? "Updating..." : "Reset Password"}</span>
                  <CheckCircle2 size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
