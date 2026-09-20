import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { OtpInput } from "../components/ui/OtpInput";
import { authApi } from "../lib/authApi";
import { setUser, clearAuth } from "../store/authSlice";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export function VerificationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const justRegistered = location.state?.justRegistered || false;

  // Get current authenticated user's email if available, or check query params
  const { user } = useSelector((state) => state.auth);
  const initialEmail = user?.email || searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Set initial countdown and success state if they just registered
  useEffect(() => {
    if (justRegistered) {
      setCooldown(60);
      setSuccessMessage("Account created successfully! A 6-digit verification code has been sent to your email.");
    }
  }, [justRegistered]);

  // Sync email state when Redux user resolves asynchronously
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user?.email, email]);

  // Cooldown countdown timer effect
  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleBackToLogin = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore network errors to ensure user is logged out locally
    } finally {
      dispatch(clearAuth());
      localStorage.removeItem("oneprofile_fallback_refresh_token");
      navigate("/login", { replace: true });
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      await authApi.verifyRegistrationResend({ email });
      setCooldown(60);
      setSuccessMessage("A fresh 6-digit verification code has been sent to your email.");
      setStatus("idle");
    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message || "Failed to send verification code. Please try again.";
      if (code === "AUTH_OTP_COOLDOWN") {
        setCooldown(60);
        setInfoMessage("A verification code was recently sent. Please check your inbox or try again in a minute.");
        setStatus("idle");
      } else {
        setErrorMessage(msg);
        setStatus("error");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!email || otp.length !== 6) return;
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      const response = await authApi.verifyRegistrationConfirm({ email, otp });
      setStatus("success");
      setSuccessMessage("Your email address has been verified successfully!");
      
      // Update Redux state with verified user
      if (response.data?.data?.user) {
        dispatch(setUser(response.data.data.user));
      } else {
        // Fallback: fetch current authenticated user
        const meResponse = await authApi.me();
        dispatch(setUser(meResponse.data.data));
      }

      // Smooth redirect after 1.5 seconds so user can see success state
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired verification code."
      );
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#9FE870]/30 text-[#163300] mb-2 shadow-xs">
          <Mail className="w-6 h-6 text-[#163300]" />
        </div>
        <h2 className="font-parafina text-2.5xl sm:text-3xl font-black text-[#163300] tracking-tight">
          Verify your email
        </h2>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          We sent a 6-digit verification code to{" "}
          <span className="text-slate-900 font-bold">{email || "your email address"}</span>.
        </p>
      </div>

      {successMessage && (
        <Alert variant="success" className="flex items-start gap-2">
          <span>{successMessage}</span>
        </Alert>
      )}

      {infoMessage && (
        <Alert variant="info" className="flex items-start gap-2">
          <span>{infoMessage}</span>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="error" className="flex items-start gap-2">
          <span>{errorMessage}</span>
        </Alert>
      )}

      {!email ? (
        <div className="space-y-4">
          <Input
            label="Email address"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full text-sm font-bold"
            onClick={handleResendCode}
            disabled={!email || isResending}
          >
            {isResending ? "Sending..." : "Send Verification Code"}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-2">
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              error={status === "error" ? errorMessage : ""}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm font-bold shadow-md shadow-[#163300]/10"
              loading={status === "loading"}
              disabled={otp.length !== 6 || status === "success"}
            >
              Verify Code
            </Button>

            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || isResending}
                className="text-[#163300] hover:underline disabled:text-slate-400 font-bold transition-colors"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
              {cooldown > 0 && (
                <span className="text-slate-400 font-medium">
                  Resend in {cooldown}s
                </span>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-center">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="text-slate-500 hover:text-[#163300] transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>
      </div>
    </motion.div>
  );
}

