import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "../components/ui/Spinner";

export function ProtectedRoute() {
  const location = useLocation();
  const { accessToken, bootstrapped, user } = useSelector(
    (state) => state.auth,
  );
  if (!bootstrapped) {
    return (
      <div className="grid min-h-screen place-items-center bg-oneprofile-950 text-white">
        <Spinner />
      </div>
    );
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (user && !user.emailVerified) {
    return <Navigate to="/verify" replace />;
  }
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (!isOnboardingRoute && user && user.onboardingStatus !== "published") {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
