import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { OtpInput } from "../components/ui/OtpInput";
import { Alert } from "../components/ui/Alert";
import { authApi } from "../lib/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";

const requestSchema = z.object({
  identifier: z.string().min(3, "Enter your email or phone"),
});

const verifySchema = z.object({
  identifier: z.string().min(3, "Enter your email or phone"),
  otp: z.string().min(4, "Code must be at least 4 digits"),
});

export function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { identifier: "" },
  });
  const verifyForm = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: { identifier: "", otp: "" },
  });

  const requestMutation = useMutation({
    mutationFn: (values) => authApi.requestOtpLogin(values),
    onSuccess: (_, values) => {
      setIdentifier(values.identifier);
      verifyForm.setValue("identifier", values.identifier);
      setMode("verify");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (values) => authApi.verifyOtpLogin(values),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data.data));
      navigate("/dashboard");
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
          One-time login
        </h2>
        <p className="text-xs sm:text-sm text-[#576159]">
          Sign in instantly without a password using an SMS or email verification code.
        </p>
      </div>

      {mode === "request" ? (
        <form
          className="space-y-4"
          onSubmit={requestForm.handleSubmit((values) =>
            requestMutation.mutate(values),
          )}
          noValidate
        >
          <Input
            label="Email or phone"
            placeholder="name@company.com or +91 98765 43210"
            {...requestForm.register("identifier")}
            error={requestForm.formState.errors.identifier?.message}
          />
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-xs font-semibold shadow-xs"
              loading={requestMutation.isPending}
            >
              Send verification code
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={verifyForm.handleSubmit((values) =>
            verifyMutation.mutate(values),
          )}
          noValidate
        >
          <Input
            label="Email or phone"
            readOnly
            value={identifier}
            {...verifyForm.register("identifier")}
          />
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#121814] select-none">
              Verification code
            </label>
            <div className="flex justify-center py-2">
              <OtpInput
                length={6}
                value={verifyForm.watch("otp")}
                onChange={(otp) => verifyForm.setValue("otp", otp)}
                error={verifyForm.formState.errors.otp?.message}
              />
            </div>
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-xs font-semibold shadow-xs"
              loading={verifyMutation.isPending}
            >
              Verify & Enter
            </Button>
          </div>
        </form>
      )}

      {requestMutation.isError || verifyMutation.isError ? (
        <Alert variant="error">
          Something went wrong. Please check your details and try again.
        </Alert>
      ) : null}

      <div className="pt-4 border-t border-black/[0.06] text-xs text-center">
        <Link
          className="text-[#576159] hover:text-[#121814] transition-colors"
          to="/login"
        >
          ← Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

