import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase, getDatabaseStatus } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

let server;
let shuttingDown = false;

async function shutdown(signal, error = null) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (error) {
    logger.error({ signal, error }, "Shutting down due to fatal error");
  } else {
    logger.info({ signal }, "Shutting down gracefully");
  }

  const forceExitTimer = setTimeout(() => {
    logger.error({ signal }, "Forced exit after shutdown timeout");
    process.exit(error ? 1 : 0);
  }, 10000);
  forceExitTimer.unref();

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDatabase();
  } catch (shutdownError) {
    logger.error({ shutdownError }, "Error during shutdown");
  } finally {
    clearTimeout(forceExitTimer);
    process.exit(error ? 1 : 0);
  }
}

function registerProcessHandlers() {
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("uncaughtException", (error) => void shutdown("uncaughtException", error));
  process.on("unhandledRejection", (error) => void shutdown("unhandledRejection", error));
}

async function bootstrap() {
  registerProcessHandlers();

  const databaseConnection = await connectDatabase({
    allowDegradedMode: env.MONGODB_ALLOW_DEGRADED_MODE,
  });

  const app = createApp();

  server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        database: getDatabaseStatus(),
        degradedMode: !databaseConnection,
      },
      "oneprofile API listening",
    );
  });
}

bootstrap().catch((error) => {
  logger.error({ error }, "Failed to bootstrap API");
  process.exit(1);
});
