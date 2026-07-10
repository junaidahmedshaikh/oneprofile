import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

export function SecurityTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 select-none">
      <div>
        <h3 className="font-display text-lg font-bold text-slate-300 dark:text-white tracking-tight">
          Account & Security
        </h3>
        <p className="text-3xs text-oneprofile-600 font-bold uppercase tracking-wider mt-0.5">
          Manage session monitors, credentials, and visibility states
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Device Sessions Box */}
        <div className="p-5 rounded-2xl bg-oneprofile-900/20 border border-oneprofile-700 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xl">🔑</span>
            <h4 className="text-xs font-bold text-slate-300 dark:text-white uppercase tracking-wider">
              Device & Sessions Management
            </h4>
            <p className="text-3xs text-oneprofile-600 font-semibold leading-normal">
              Monitor active logins, revoke unauthorized devices, and inspect OS
              details.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="text-3xs font-extrabold w-full h-8.5 min-h-[34px] uppercase tracking-wider rounded-xl"
            onClick={() => navigate("/sessions")}
          >
            Manage Sessions
          </Button>
        </div>

        {/* Multi-Factor Authentication Box */}
        <div className="p-5 rounded-2xl bg-oneprofile-900/20 border border-oneprofile-700 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xl">🛡️</span>
            <h4 className="text-xs font-bold text-slate-300 dark:text-white uppercase tracking-wider">
              Verification Center
            </h4>
            <p className="text-3xs text-oneprofile-600 font-semibold leading-normal">
              Activate phone validation, setup backup login emails, and verify
              account security level.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="text-3xs font-extrabold w-full h-8.5 min-h-[34px] uppercase tracking-wider rounded-xl"
            onClick={() => navigate("/verify")}
          >
            Verify Credentials
          </Button>
        </div>
      </div>
    </div>
  );
}
