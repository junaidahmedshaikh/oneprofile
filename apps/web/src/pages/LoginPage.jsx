import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { SocialLoginButton } from "../components/auth/SocialLoginButton";
import { authApi } from "../lib/authApi";
import { setCredentials } from "../store/authSlice";

const schema = z.object({
  identifier: z.string().min(3, "Enter your email or phone"),
  password: z.string().min(1, "Password is required"),
});

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (values) => authApi.login(values),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data.data));
      setSuccessMessage("Welcome back. You are being redirected.");
      navigate("/dashboard");
    },
  });

  const onSubmit = form.handleSubmit((values) => loginMutation.mutate(values));

  const googleMutation = useMutation({
    mutationFn: () => authApi.googleStart(),
    onSuccess: (response) => {
      window.location.href = response.data.data.url;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2.5xl font-extrabold text-slate-300 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-oneprofile-600 font-semibold">
          Sign in with password or move to OTP/Google connection.
        </p>
      </div>

      {loginMutation.isError ? (
        <Alert variant="error">
          {loginMutation.error?.response?.data?.message ||
            "Login failed. Check your credentials and try again."}
        </Alert>
      ) : null}
      {successMessage ? (
        <Alert variant="success">{successMessage}</Alert>
      ) : null}

      <form className="space-y-4 " onSubmit={onSubmit} noValidate>
        <Input
          label="Email or phone"
          placeholder="name@company.com"
          className="w-full placeholder:py-2"
          {...form.register("identifier")}
          error={form.formState.errors.identifier?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <div className="pt-2">
          <Button
            type="submit"
            loading={loginMutation.isPending}
            // type="button"
            variant="secondary"
            className="text-xs font-bold w-full"
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="flex-shrink mx-4 text-3xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            or connect with
          </span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        <SocialLoginButton
          onClick={() => googleMutation.mutate()}
          loading={googleMutation.isPending}
        />
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.05] text-xs font-semibold sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="text-slate-400 hover:text-white transition-colors"
          to="/forgot-password"
        >
          Forgot your password?
        </Link>
        <Link
          className="text-brand-400 hover:text-brand-300 transition-colors"
          to="/signup"
        >
          Create a new account
        </Link>
      </div>
    </motion.div>
  );
}
