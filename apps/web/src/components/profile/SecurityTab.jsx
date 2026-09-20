import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert } from "../ui/Alert";
import { OtpInput } from "../ui/OtpInput";
import { authApi } from "../../lib/authApi";
import { setUser } from "../../store/authSlice";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function SecurityTab() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request"); // 'request' | 'verify'
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setErrorMessage("New email address must be different from your current email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await authApi.changeEmailRequest({ newEmail });
      setCooldown(60);
      setSuccessMessage("A verification code has been sent to the new email address.");
      setStep("verify");
      setStatus("idle");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to send verification code. Please try again."
      );
      setStatus("error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!newEmail || otp.length !== 6) return;
    setStatus("loading");
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await authApi.changeEmailConfirm({ newEmail, otp });
      setStatus("success");
      setSuccessMessage("Your email address has been successfully updated!");
      
      if (response.data?.data?.user) {
        dispatch(setUser(response.data.data.user));
      } else {
        const meResponse = await authApi.me();
        dispatch(setUser(meResponse.data.data));
      }

      setTimeout(() => {
        setNewEmail("");
        setOtp("");
        setStep("request");
        setStatus("idle");
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Invalid or expired verification code."
      );
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setNewEmail("");
    setOtp("");
    setStep("request");
    setStatus("idle");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="space-y-8 select-none">
      <div className="space-y-1">
        <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
          Account & Security
        </h3>
        <p className="text-xs text-slate-500">
          Manage session monitors, credentials, authentication, and login states
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Device Sessions Box */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-lg">
              🔑
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Device & Sessions Management
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor active logins, revoke unauthorized devices, and inspect OS and browser details.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-bold"
            onClick={() => navigate("/sessions")}
          >
            Manage Active Sessions
          </Button>
        </div>

        {/* Multi-Factor Verification Box */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-lg">
              🛡️
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Verification Center
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Activate phone validation, setup backup login methods, and verify account security level.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-bold"
            onClick={() => navigate("/verify")}
          >
            Verify Credentials
          </Button>
        </div>
      </div>

      {/* Change Email Address Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/60 border border-slate-200 space-y-5">
        <div className="space-y-1">
          <h4 className="font-parafina text-base font-bold text-slate-900 tracking-tight">
            Change Account Email Address
          </h4>
          <p className="text-xs text-slate-500">
            Current Email: <span className="text-slate-900 font-bold">{user?.email || "Not set"}</span>
          </p>
        </div>

        {successMessage && (
          <Alert variant="success" className="flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="error" className="flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </Alert>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 max-w-md">
            <Input
              label="New Email Address"
              placeholder="e.g. new-email@company.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={status === "loading"}
            />
            <Button
              type="submit"
              className="text-xs font-bold"
              loading={status === "loading"}
              disabled={!newEmail}
            >
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5 max-w-md">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">
                Verification Code
              </span>
              <p className="text-xs text-slate-500">
                Please enter the 6-digit code sent to <span className="text-slate-900 font-bold">{newEmail}</span>.
              </p>
            </div>

            <div className="flex py-1">
              <OtpInput
                length={6}
                value={otp}
                onChange={setOtp}
                error={status === "error" ? errorMessage : ""}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="text-xs font-bold"
                loading={status === "loading"}
                disabled={otp.length !== 6 || status === "success"}
              >
                Verify & Update Email
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="text-xs font-bold"
                onClick={handleCancel}
                disabled={status === "loading"}
              >
                Cancel
              </Button>

              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={cooldown > 0 || status === "loading"}
                className="text-xs font-bold text-[#163300] hover:underline disabled:text-slate-400 transition-colors ml-auto"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

