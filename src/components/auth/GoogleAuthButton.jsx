import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { googleAuthApi } from "../../services/authApi";

/**
 * Official Google "G" Logo
 */
function GoogleIcon({ className = "w-4 h-4 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/**
 * Reusable Google Authentication Button for Login and Register pages.
 * Integrates Google Identity Services (GIS) with backend verification and JWT session management.
 */
export default function GoogleAuthButton({
  mode = "login", // 'login' | 'register'
  from = "/account",
  onError,
  onSuccess,
}) {
  const navigate = useNavigate();
  const { loginWithToken, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const tokenClientRef = useRef(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Load Google Identity Services SDK script if not already present
  useEffect(() => {
    if (window.google?.accounts?.oauth2) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn("Could not load Google Identity Services SDK.");
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleClick = () => {
    if (!clientId) {
      const msg =
        "Google Sign-In is not configured yet. Please ensure VITE_GOOGLE_CLIENT_ID is set in your environment.";
      if (onError) onError(msg);
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      if (onError) onError("Google Sign-In SDK is still loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setLoading(false);
            if (
              tokenResponse.error === "popup_closed_by_user" ||
              tokenResponse.error === "access_denied"
            ) {
              // User dismissed or closed popup
              return;
            }
            if (onError) onError(`Google Sign-In was cancelled or failed (${tokenResponse.error}).`);
            return;
          }

                    try {
            // Authenticate and establish application session
            let authResult;
            if (typeof loginWithGoogle === "function") {
              authResult = await loginWithGoogle({
                accessToken: tokenResponse.access_token,
              });
            } else {
              authResult = await googleAuthApi({
                accessToken: tokenResponse.access_token,
              });
              if (typeof loginWithToken === "function") {
                loginWithToken(authResult.user, authResult.token);
              }
            }

            if (onSuccess) {
              onSuccess(authResult);
            } else {
              const redirectPath =
                from && from !== "/login" && from !== "/register" ? from : "/account";
              navigate(redirectPath, { replace: true });
            }
          } catch (err) {
            if (onError) onError(err.message || "Failed to authenticate with Google. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        error_callback: (err) => {
          setLoading(false);
          if (err?.type !== "popup_closed") {
            if (onError) onError("Google Sign-In popup was closed or encountered an issue.");
          }
        },
      });

      // Open Google OAuth Account Chooser
      tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      setLoading(false);
      if (onError) onError(err.message || "Failed to initialize Google Sign-In.");
    }
  };

  return (
    <div className="w-full">
      {/* Subtle Luxury Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-[#171715] px-3 text-[10px] uppercase tracking-[0.2em] text-[#8e8a82]">
          Or continue with
        </div>
      </div>

      {/* Continue with Google Action Button */}
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="rounded-2xl w-full flex items-center justify-center gap-3 border border-white/15 bg-[#11110f] hover:border-[#c6a15b]/60 hover:bg-[#181814] active:scale-[0.99] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#f4efe6] transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50"
      >
        <GoogleIcon />
        <span>
          {loading
            ? "Connecting to Google..."
            : mode === "register"
            ? "Sign up with Google"
            : "Continue with Google"}
        </span>
      </button>
    </div>
  );
}

