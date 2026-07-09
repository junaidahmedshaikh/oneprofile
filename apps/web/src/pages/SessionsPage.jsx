import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/authApi';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { clearAuth } from '../store/authSlice';
import { motion } from 'framer-motion';

export function SessionsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionsQuery = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const response = await authApi.sessions();
      return response.data.data;
    }
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSettled: () => {
      dispatch(clearAuth());
      navigate('/login', { replace: true });
    }
  });

  // Helper function to return beautiful custom device icons
  const getDeviceIcon = (deviceType = "") => {
    const lowerType = deviceType.toLowerCase();
    if (lowerType.includes("desktop") || lowerType.includes("mac") || lowerType.includes("windows")) {
      return (
        <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Device Sessions</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor signed-in devices and revoke session access if needed.</p>
        </div>
        
        <Button 
          variant="destructive" 
          loading={logoutAllMutation.isPending} 
          onClick={() => logoutAllMutation.mutate()}
          className="rounded-xl h-10 min-h-10 text-xs font-bold"
        >
          Revoke all sessions
        </Button>
      </div>

      {sessionsQuery.isError ? (
        <Alert variant="error">Unable to load active sessions.</Alert>
      ) : null}

      {sessionsQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse h-36 bg-white/[0.01] border-white/[0.04]" />
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessionsQuery.data?.map((session) => (
          <Card key={session._id} hoverEffect className="flex flex-col justify-between h-40">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                {getDeviceIcon(session.deviceType)}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-bold text-white truncate max-w-[150px]">
                  {session.deviceName || 'Unnamed Device'}
                </div>
                <div className="text-2xs text-slate-400 capitalize">
                  {session.deviceType || 'Unknown Client'}
                </div>
                <div className="text-3xs text-slate-500 font-medium tracking-tight">
                  {session.os || 'Unknown OS'} • {session.browser || 'Unknown Browser'}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3.5">
              <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">Session status</span>
              {session.isRevoked ? (
                <span className="inline-flex items-center gap-1 text-3xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                  <span className="h-1 w-1 rounded-full bg-red-400" />
                  Revoked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-3xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {!sessionsQuery.data?.length && sessionsQuery.isSuccess ? (
        <Card className="text-center py-8">
          <p className="text-sm text-slate-400">No session histories available for this account.</p>
        </Card>
      ) : null}
    </motion.div>
  );
}
