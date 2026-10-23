import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { sendSignupOtpApi, verifySignupOtpApi } from "../services/authApi";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [formData, setFormData] = useState({
    fullName: "",
    email: emailParam,
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const from = searchParams.get("redirect") || "/account";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // 60-second Resend countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Step 1: Send OTP to verify email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendSignupOtpApi(formData.email.trim());
      setStep(2);
      setCooldown(30);
    } catch (err) {
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await sendSignupOtpApi(formData.email.trim());
      setCooldown(30);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await verifySignupOtpApi({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        otpCode: otpCode.trim(),
      });

      // Save token and user in localStorage
      localStorage.setItem("tdb_token", data.token);
      localStorage.setItem("tdb_user", JSON.stringify(data.user));

      navigate(from, { replace: true });
      window.location.reload(); // Refresh auth state
    } catch (err) {
      setError(err.message || "Invalid verification code. Please try again.");
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
            Join The Decant Bar
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            {step === 1 ? "Create Your Account" : "Verify Your Email"}
          </h1>
          <p className="mt-3 text-xs text-[#8e8a82]">
            {step === 1
              ? "Enjoy streamlined ordering, saved delivery preferences, and priority decant releases."
              : `We sent a 6-digit verification code to ${formData.email}. Please enter it below.`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {error.includes("Please log in") && (
              <div className="mt-3 pl-7">
                <Link
                  to={`/login?email=${encodeURIComponent(formData.email)}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#c6a15b] underline hover:text-[#d8c08a] transition"
                >
                  Sign in to your account now &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form Card */}
        <div className="mt-8 border border-white/10 bg-[#171715] p-6 sm:p-8 shadow-2xl">
          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                  Full Name <span className="text-[#c6a15b]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                  <User size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                  Email Address <span className="text-[#c6a15b]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                  Password <span className="text-[#c6a15b]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                  Confirm Password <span className="text-[#c6a15b]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8e8a82]" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer shadow-lg !mt-6"
              >
                <span>{isSubmitting ? "Sending Verification Code..." : "Send Verification Code"}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* Step 2: OTP Input Form */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-4 bg-[#11110f] border border-[#c6a15b]/30 rounded text-center">
                <p className="text-xs text-[#c5c1b9]">Verification Code Sent To</p>
                <p className="text-sm font-semibold text-[#c6a15b] mt-1">{formData.email}</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-2 font-medium text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full border border-[#c6a15b] bg-[#11110f] py-3.5 text-center text-2xl font-mono tracking-[0.5em] text-[#f4efe6] placeholder-[#8e8a82]/40 transition focus:outline-none focus:ring-1 focus:ring-[#c6a15b]"
                  />
                  <KeyRound size={18} className="absolute left-4 top-4 text-[#c6a15b]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  className="text-[#8e8a82] hover:text-[#f4efe6] transition cursor-pointer"
                >
                  &larr; Change Details
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || isSubmitting}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-[#c6a15b] hover:text-[#d8c08a] transition font-medium disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length !== 6}
                className="w-full flex items-center justify-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer shadow-lg mt-4"
              >
                <span>{isSubmitting ? "Verifying..." : "Verify & Activate Account"}</span>
                <CheckCircle2 size={15} />
              </button>
            </form>
          )}

          {/* Switch to Login */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-[#8e8a82]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#c6a15b] font-medium hover:underline hover:text-[#d8c08a] transition"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#8e8a82]">
          <ShieldCheck size={14} className="text-[#c6a15b]" />
          <span>Protected with rate limiting & cryptographic OTP verification</span>
        </div>
      </div>
    </Container>
  );
}
