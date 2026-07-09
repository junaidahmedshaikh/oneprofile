import fs from "node:fs";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import { z } from "zod";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const configDir = path.dirname(fileURLToPath(import.meta.url));
const apiEnvPath = path.resolve(configDir, "../../.env");
const rootEnvPath = path.resolve(configDir, "../../../../.env");
const envPath = [apiEnvPath, rootEnvPath].find((candidate) =>
  fs.existsSync(candidate),
);

if (envPath) {
  dotenv.config({ path: envPath });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1),
  MONGODB_DIRECT_URI: z.string().optional().default(""),
  MONGODB_ALLOW_DEGRADED_MODE: z.preprocess(
    (value) => value === true || value === "true" || value === "1",
    z.boolean().default(false),
  ),
  MONGODB_MAX_RETRIES: z.coerce.number().int().min(1).max(10).default(5),
  MONGODB_INITIAL_RETRY_DELAY_MS: z.coerce.number().int().min(100).default(500),
  MONGODB_MAX_RETRY_DELAY_MS: z.coerce.number().int().min(500).default(10000),
  MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().int().min(1000).default(10000),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1000)
    .default(5000),
  MONGODB_SOCKET_TIMEOUT_MS: z.coerce.number().int().min(1000).default(45000),
  CLIENT_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  GOOGLE_REDIRECT_URI: z.string().url().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().optional().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z
    .string()
    .optional()
    .default("oneprofile <no-reply@oneprofile.com>"),
  OTP_LENGTH: z.coerce.number().int().min(4).max(10).default(6),
  OTP_TTL_MINUTES: z.coerce.number().int().min(1).default(10),
  REFRESH_TOKEN_COOKIE_NAME: z.string().default("oneprofile_refresh_token"),
  ACCESS_TOKEN_COOKIE_NAME: z.string().default("oneprofile_access_token"),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
  CLOUDINARY_UPLOAD_FOLDER: z
    .string()
    .optional()
    .default("oneprofile/onboarding"),
});

export const env = envSchema.parse(process.env);
