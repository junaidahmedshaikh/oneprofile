import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { OtpInput } from "../components/ui/OtpInput";
import { authApi } from "../lib/authApi";
import { Lock, Mail, KeyRound, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("request"); // 'request' | 'verify' | 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleRequestOtp = async (values) => {
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      await authApi.forgotPasswordRequest({ email: values.email });
      setEmail(values.email);
      setCooldown(60);
      setSuccessMessage("A password reset code has been sent to your email.");
      setMode("verify");
      setStatus("idle");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to send reset code. Please check the email and try again."
      );
      setStatus("error");
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      await authApi.forgotPasswordRequest({ email });
      setCooldown(60);
      setSuccessMessage("A fresh password reset code has been sent to your email.");
      setStatus("idle");
    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message || "Failed to resend code. Please try again.";
      if (code === "AUTH_OTP_COOLDOWN") {
        setCooldown(60);
        setInfoMessage("A verification code was recently sent. Please check your inbox or try again in a minute.");
        setStatus("idle");
      } else {
        setErrorMessage(msg);
        setStatus("error");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!email || otp.length !== 6) return;
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      const response = await authApi.forgotPasswordVerify({ email, otp });
      setResetToken(response.data.data.resetToken);
      setSuccessMessage("Code verified successfully. You can now set your new password.");
      setMode("reset");
      setStatus("idle");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired reset code."
      );
      setStatus("error");
    }
  };

  const handleResetPassword = async (values) => {
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    setInfoMessage("");
    try {
      await authApi.resetPassword({ token: resetToken, password: values.password });
      setStatus("success");
      setSuccessMessage("Password reset completed successfully. Redirecting you to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
          {mode === "request" && <Mail className="w-6 h-6 text-[#2563EB]" />}
          {mode === "verify" && <KeyRound className="w-6 h-6 text-[#2563EB]" />}
          {mode === "reset" && <Lock className="w-6 h-6 text-[#2563EB]" />}
        </div>
        <h2 className="font-display text-2.5xl font-extrabold text-slate-300 dark:text-white tracking-tight">
          {mode === "request" && "Reset access"}
          {mode === "verify" && "Enter Reset Code"}
          {mode === "reset" && "Set New Password"}
        </h2>
        <p className="text-xs text-oneprofile-600 font-semibold leading-relaxed">
          {mode === "request" && "Enter your registered email address to receive a secure reset code."}
          {mode === "verify" && `We sent a 6-digit password reset code to ${email}.`}
          {mode === "reset" && "Choose a strong, unique password to secure your account access."}
        </p>
      </div>

      {successMessage && (
        <Alert variant="success" className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </Alert>
      )}

      {mode === "request" && (
        <form
          className="space-y-4"
          onSubmit={emailForm.handleSubmit(handleRequestOtp)}
          noValidate
        >
          <Input
            label="Email address"
            placeholder="name@company.com"
            {...emailForm.register("email")}
            error={emailForm.formState.errors.email?.message}
          />
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-2xl text-xs font-bold"
              loading={status === "loading"}
            >
              Send Reset Code
            </Button>
          </div>
        </form>
      )}

      {mode === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
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
              className="w-full h-12 rounded-2xl text-xs font-bold"
              loading={status === "loading"}
              disabled={otp.length !== 6 || status === "success"}
            >
              Verify Code
            </Button>

            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || status === "loading"}
                className="text-primary hover:text-primary-hover disabled:text-oneprofile-600 transition-colors"
              >
                Resend Code
              </button>
              {cooldown > 0 && (
                <span className="text-oneprofile-600">
                  Resend in {cooldown}s
                </span>
              )}
            </div>
          </div>
        </form>
      )}

      {mode === "reset" && (
        <form
          className="space-y-4"
          onSubmit={passwordForm.handleSubmit(handleResetPassword)}
          noValidate
        >
          <Input
            label="New password"
            type="password"
            placeholder="••••••••••••"
            {...passwordForm.register("password")}
            error={passwordForm.formState.errors.password?.message}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="••••••••••••"
            {...passwordForm.register("confirmPassword")}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-2xl text-xs font-bold"
              loading={status === "loading"}
            >
              Reset Password
            </Button>
          </div>
        </form>
      )}

      <div className="pt-3 border-t border-oneprofile-700 text-xs font-semibold text-center">
        <Link
          className="text-oneprofile-600 hover:text-slate-300 dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
          to="/login"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
      </div>
    </motion.div>
  );
}

