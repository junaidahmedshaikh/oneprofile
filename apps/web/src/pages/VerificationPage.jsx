import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { authApi } from "../lib/authApi";

const schema = z.object({
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  otp: z.string().optional().or(z.literal("")),
});

export function VerificationPage() {
  const [mode, setMode] = useState("email");
  const [done, setDone] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", phone: "", otp: "" },
  });

  const requestMutation = useMutation({
    mutationFn: (values) =>
      mode === "email"
        ? authApi.verifyEmailRequest({ email: values.email })
        : authApi.verifyPhoneRequest({ phone: values.phone }),
    onSuccess: () =>
      setDone(
        `${mode === "email" ? "Email" : "Phone"} verification code sent.`,
      ),
  });

  const confirmMutation = useMutation({
    mutationFn: (values) =>
      mode === "email"
        ? authApi.verifyEmailConfirm({ email: values.email, otp: values.otp })
        : authApi.verifyPhoneConfirm({ phone: values.phone, otp: values.otp }),
    onSuccess: () =>
      setDone(`${mode === "email" ? "Email" : "Phone"} verified successfully.`),
  });

  const requestCode = async () => {
    const field = mode === "email" ? "email" : "phone";
    const valid = await form.trigger(field);
    if (!valid) return;
    const values = form.getValues();
    if (!values[field]) {
      form.setError(field, {
        type: "manual",
        message: `${mode === "email" ? "Email" : "Phone"} is required`,
      });
      return;
    }
    requestMutation.mutate(values);
  };

  const confirmCode = async () => {
    const valid = await form.trigger(
      mode === "email" ? ["email", "otp"] : ["phone", "otp"],
    );
    if (!valid) return;
    const values = form.getValues();
    if (!values.otp) {
      form.setError("otp", { type: "manual", message: "OTP is required" });
      return;
    }
    confirmMutation.mutate(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2.5xl font-extrabold text-slate-300 dark:text-white tracking-tight">
          Verification center
        </h2>
        <p className="text-xs text-oneprofile-600 font-semibold">
          Verify your email or phone to complete account activation.
        </p>
      </div>

      {done ? <Alert variant="success">{done}</Alert> : null}

      <div className="flex gap-2 p-1 rounded-2xl bg-oneprofile-900/60 border border-oneprofile-700">
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === "email" ? "bg-primary/10 text-slate-300 dark:text-white border border-primary/20" : "text-oneprofile-600 hover:text-slate-300 dark:hover:text-white"}`}
        >
          Email verification
        </button>
        <button
          type="button"
          onClick={() => setMode("phone")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === "phone" ? "bg-primary/10 text-slate-300 dark:text-white border border-primary/20" : "text-oneprofile-600 hover:text-slate-300 dark:hover:text-white"}`}
        >
          Phone verification
        </button>
      </div>

      <div className="space-y-4">
        {mode === "email" ? (
          <Input
            label="Email address"
            placeholder="name@company.com"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
        ) : (
          <Input
            label="Phone number"
            placeholder="+15550199"
            {...form.register("phone")}
            error={form.formState.errors.phone?.message}
          />
        )}

        <Input
          label="Verification code"
          placeholder="Enter 6-digit code"
          {...form.register("otp")}
          error={form.formState.errors.otp?.message}
        />

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            loading={requestMutation.isPending}
            onClick={requestCode}
          >
            Request Code
          </Button>
          <Button
            type="button"
            loading={confirmMutation.isPending}
            onClick={confirmCode}
          >
            Verify Code
          </Button>
        </div>
      </div>

      {requestMutation.isError || confirmMutation.isError ? (
        <Alert variant="error">
          Verification failed. Check the code and try again.
        </Alert>
      ) : null}
    </motion.div>
  );
}
