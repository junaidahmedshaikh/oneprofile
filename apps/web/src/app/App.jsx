import { Routes, Route, Navigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { AppShell } from "../components/layout/AppShell";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { PublicOnlyRoute } from "../routes/PublicOnlyRoute";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { OtpPage } from "../pages/OtpPage";
import { VerificationPage } from "../pages/VerificationPage";
import { DashboardPage } from "../pages/DashboardPage";
import { SessionsPage } from "../pages/SessionsPage";
import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { OnboardingPage } from "../pages/OnboardingPage";

function Placeholder({ title, description }) {
  return (
    <div className="relative rounded-[32px] border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden max-w-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 text-xl shadow-inner">
          ✨
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2.5xl font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-sm leading-relaxed text-slate-400">{description}</p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-3xs font-bold uppercase tracking-wider text-brand-400">
              <span className="h-1 w-1 rounded-full bg-brand-400 animate-pulse" />
              Feature In Development
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route
          element={
            <AuthShell
              eyebrow="Authentication"
              title="Secure access for modern business identity."
              subtitle="Login, signup, OTP, verification, and recovery flows designed for enterprise-grade trust and clarity."
            />
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/otp" element={<OtpPage />} />
        </Route>
      </Route>

      <Route
        element={
          <AuthShell
            eyebrow="Verification"
            title="Confirm your identity."
            subtitle="Finish activating your account with secure email or phone verification."
          />
        }
      >
        <Route path="/verify" element={<VerificationPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<OnboardingShell />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route
            path="/identity"
            element={
              <Placeholder
                title="Identity Settings"
                description="This module is ready for profile, roles, and verification management in the next build phase."
              />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
