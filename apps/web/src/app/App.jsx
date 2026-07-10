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
import { IdentityPage } from "../pages/IdentityPage";
import { PublicProfilePage } from "../pages/PublicProfilePage";

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

      {/* Public profile page route */}
      <Route path="/p/:slug" element={<PublicProfilePage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<OnboardingShell />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/identity" element={<IdentityPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
