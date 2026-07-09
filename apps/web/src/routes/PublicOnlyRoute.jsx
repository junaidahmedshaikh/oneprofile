import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "../components/ui/Spinner";

export function PublicOnlyRoute() {
  const { accessToken, bootstrapped } = useSelector((state) => state.auth);
  if (!bootstrapped) {
    return (
      <div className="grid min-h-screen place-items-center bg-oneprofile-950 text-white">
        <Spinner />
      </div>
    );
  }
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
