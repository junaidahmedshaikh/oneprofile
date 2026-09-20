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
      const newRefreshToken = response.data?.data?.refreshToken;
      if (newRefreshToken) {
        localStorage.setItem("oneprofile_fallback_refresh_token", newRefreshToken);
      }
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
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="space-y-1.5">
        <h2 className="font-display text-2.5xl sm:text-3xl font-bold text-[#121814] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-[#576159]">
          Sign in to manage your digital identity, cards, and analytics.
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

      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Email or phone"
          placeholder="name@company.com"
          {...form.register("identifier")}
          error={form.formState.errors.identifier?.message}
        />
        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <div className="flex justify-end pt-1">
            <Link
              className="text-xs font-semibold text-[#576159] hover:text-[#121814] transition-colors"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={loginMutation.isPending}
            variant="primary"
            size="lg"
            className="w-full text-xs font-semibold shadow-xs"
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-black/[0.08]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-wider text-[#879289]">
            or continue with
          </span>
          <div className="flex-grow border-t border-black/[0.08]"></div>
        </div>

        <SocialLoginButton
          label="Sign in with Google"
          onClick={() => googleMutation.mutate()}
          loading={googleMutation.isPending}
        />
      </div>

      <div className="pt-4 border-t border-black/[0.06] text-center text-xs text-[#576159]">
        Don't have an account yet?{" "}
        <Link
          className="font-semibold text-[#163300] hover:underline transition-colors ml-1"
          to="/signup"
        >
          Create account
        </Link>
      </div>
    </motion.div>
  );
}

