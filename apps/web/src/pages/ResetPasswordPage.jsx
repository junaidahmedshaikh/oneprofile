import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { authApi } from '../lib/authApi';

const schema = z.object({
  token: z.string().min(8, "Token must be at least 8 characters"),
  password: z.string().min(12, "Use at least 12 characters")
});

export function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: '', password: '' }
  });

  const mutation = useMutation({
    mutationFn: (values) => authApi.resetPassword(values),
    onSuccess: () => setDone(true)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2.5xl font-extrabold text-white tracking-tight">Set a new password</h2>
        <p className="text-sm text-slate-400">Use the reset token sent to your email.</p>
      </div>

      {done ? <Alert variant="success">Password updated. You can now sign in again.</Alert> : null}
      
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
        <Input 
          label="Reset token" 
          placeholder="Enter token code"
          {...form.register('token')} 
          error={form.formState.errors.token?.message} 
        />
        <Input 
          label="New password" 
          type="password" 
          placeholder="••••••••••••"
          {...form.register('password')} 
          error={form.formState.errors.password?.message} 
        />
        
        <div className="pt-2">
          <Button type="submit" className="w-full h-12 rounded-2xl" loading={mutation.isPending}>
            Update password
          </Button>
        </div>
      </form>

      <div className="pt-3 border-t border-white/[0.05] text-xs font-semibold text-center">
        <Link className="text-slate-400 hover:text-white transition-colors" to="/login">
          Back to login
        </Link>
      </div>
    </motion.div>
  );
}
