import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { authApi } from "../lib/authApi";

const schema = z.object({
  token: z.string().min(8, "Token must be at least 8 characters"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values) => authApi.resetPassword(values),
    onSuccess: () => setDone(true),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="space-y-1.5">
        <h2 className="font-parafina text-2.5xl sm:text-3xl font-black text-[#163300] tracking-tight">
          Set a new password
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Enter your reset token code and choose your new password.
        </p>
      </div>

      {done ? (
        <Alert variant="success">
          Password updated successfully. You can now sign in with your new credentials.
        </Alert>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Input
          label="Reset token"
          placeholder="Enter token code"
          {...form.register("token")}
          error={form.formState.errors.token?.message}
        />
        <Input
          label="New password"
          type="password"
          placeholder="••••••••••••"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm font-bold shadow-md shadow-[#163300]/10"
            loading={mutation.isPending}
          >
            Update Password
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-center">
        <Link
          className="text-slate-500 hover:text-[#163300] transition-colors"
          to="/login"
        >
          ← Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

