import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { getDatabaseStatus } from "./config/database.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const allowedOrigins = [env.CLIENT_URL, env.BACKEND_URL];

        const isAllowed = allowedOrigins.some((allowed) => {
          if (allowed instanceof RegExp) {
            return allowed.test(origin);
          }
          return allowed === origin;
        });

        if (
          isAllowed ||
          /^https:\/\/oneprofile-[a-z0-9-]+\.vercel\.app$/.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => {
    const dbStatus = getDatabaseStatus();

    res.json({
      success: true,
      message: "healthy",
      database: dbStatus,
    });
  });
  app.use("/api/v1", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
