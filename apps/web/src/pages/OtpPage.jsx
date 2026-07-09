import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OtpInput } from '../components/ui/OtpInput';
import { Alert } from '../components/ui/Alert';
import { authApi } from '../lib/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

const requestSchema = z.object({
  identifier: z.string().min(3, "Enter your email or phone")
});

const verifySchema = z.object({
  identifier: z.string().min(3, "Enter your email or phone"),
  otp: z.string().min(4, "Code must be at least 4 digits")
});

export function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('request');
  const [identifier, setIdentifier] = useState('');
  const requestForm = useForm({ resolver: zodResolver(requestSchema), defaultValues: { identifier: '' } });
  const verifyForm = useForm({ resolver: zodResolver(verifySchema), defaultValues: { identifier: '', otp: '' } });

  const requestMutation = useMutation({
    mutationFn: (values) => authApi.requestOtpLogin(values),
    onSuccess: (_, values) => {
      setIdentifier(values.identifier);
      verifyForm.setValue('identifier', values.identifier);
      setMode('verify');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: (values) => authApi.verifyOtpLogin(values),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data.data));
      navigate('/dashboard');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2.5xl font-extrabold text-white tracking-tight">One-time login</h2>
        <p className="text-sm text-slate-400">Request a secure OTP and verify it here.</p>
      </div>

      {mode === 'request' ? (
        <form className="space-y-4" onSubmit={requestForm.handleSubmit((values) => requestMutation.mutate(values))} noValidate>
          <Input 
            label="Email or phone" 
            placeholder="name@company.com or +15550000"
            {...requestForm.register('identifier')} 
            error={requestForm.formState.errors.identifier?.message} 
          />
          <div className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-2xl" loading={requestMutation.isPending}>
              Send verification code
            </Button>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={verifyForm.handleSubmit((values) => verifyMutation.mutate(values))} noValidate>
          <Input label="Email or phone" readOnly value={identifier} {...verifyForm.register('identifier')} />
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
              Verification code
            </label>
            <div className="flex justify-center py-2">
              <OtpInput 
                length={6}
                value={verifyForm.watch('otp')} 
                onChange={(otp) => verifyForm.setValue('otp', otp)} 
                error={verifyForm.formState.errors.otp?.message} 
              />
            </div>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-2xl" loading={verifyMutation.isPending}>
              Verify code
            </Button>
          </div>
        </form>
      )}

      {(requestMutation.isError || verifyMutation.isError) ? (
        <Alert variant="error">Something went wrong. Please check details and try again.</Alert>
      ) : null}

      <div className="pt-3 border-t border-white/[0.05] text-xs font-semibold text-center">
        <Link className="text-slate-400 hover:text-white transition-colors" to="/login">
          Back to login
        </Link>
      </div>
    </motion.div>
  );
}
