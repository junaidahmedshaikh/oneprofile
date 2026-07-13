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

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    password: z.string().min(8, "Use at least 8 characters"),
    phone: z.string().optional().or(z.literal("")),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Provide an email or phone number",
    path: ["email"],
  });

export function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [info, setInfo] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const mutation = useMutation({
    mutationFn: (values) => authApi.register(values),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data.data));
      setInfo(
        "Account created. Please verify your email from the verification screen.",
      );
      navigate("/verify");
    },
  });

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
          Create account
        </h2>
        <p className="text-xs text-oneprofile-600 font-semibold">
          Start your oneprofile identity workspace in minutes.
        </p>
      </div>

      {mutation.isError ? (
        <Alert variant="error">
          {mutation.error?.response?.data?.message ||
            "Registration failed. Check your details and try again."}
        </Alert>
      ) : null}
      {info ? <Alert variant="success">{info}</Alert> : null}

      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Input
          label="Full name"
          placeholder="Sarah Connor"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <Input
          label="Email address"
          placeholder="name@company.com"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
        <Input
          label="Phone number (optional)"
          placeholder="+1 (555) 000-0000"
          {...form.register("phone")}
          error={form.formState.errors.phone?.message}
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
            variant="secondary"
            className="text-xs font-bold w-full"
            loading={mutation.isPending}
          >
            Create account
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
          label="Sign up with Google"
          onClick={() => googleMutation.mutate()}
          loading={googleMutation.isPending}
        />
      </div>

      <div className="pt-3 border-t border-white/[0.05] text-xs text-slate-400 font-semibold text-center">
        Already have an account?{" "}
        <Link
          className="text-brand-400 hover:text-brand-300 transition-colors"
          to="/login"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
