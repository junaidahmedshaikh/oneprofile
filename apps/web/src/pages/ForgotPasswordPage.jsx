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
  identifier: z.string().min(3, "Enter your email or phone"),
});

export function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "" },
  });

  const mutation = useMutation({
    mutationFn: (values) => authApi.forgotPassword(values),
    onSuccess: () => setDone(true),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2.5xl font-extrabold text-slate-300 dark:text-white tracking-tight">
          Reset access
        </h2>
        <p className="text-xs text-oneprofile-600 font-semibold">
          We will send a secure reset link if the account exists.
        </p>
      </div>

      {done ? (
        <Alert variant="success">
          If the account exists, a reset message has been sent.
        </Alert>
      ) : null}

      <form
        className="space-y-4.5"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <Input
          label="Email or phone"
          placeholder="name@company.com"
          {...form.register("identifier")}
          error={form.formState.errors.identifier?.message}
        />
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 rounded-2xl"
            loading={mutation.isPending}
          >
            Send reset link
          </Button>
        </div>
      </form>

      <div className="pt-3 border-t border-oneprofile-700 text-xs font-semibold text-center">
        <Link
          className="text-oneprofile-600 hover:text-slate-300 dark:hover:text-white transition-colors"
          to="/login"
        >
          Back to login
        </Link>
      </div>
    </motion.div>
  );
}
