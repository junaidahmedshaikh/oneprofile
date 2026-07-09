import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

let connectionPromise = null;
let connectionEventsRegistered = false;

const RETRYABLE_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENOTFOUND'
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(ms) {
  const spread = Math.max(50, Math.round(ms * 0.2));
  return ms + Math.floor(Math.random() * spread);
}

function getBackoffDelay(attempt) {
  const delay = env.MONGODB_INITIAL_RETRY_DELAY_MS * (2 ** Math.max(0, attempt - 1));
  return Math.min(env.MONGODB_MAX_RETRY_DELAY_MS, jitter(delay));
}

function isSrvUri(uri) {
  return uri.startsWith('mongodb+srv://');
}

function extractSrvHost(uri) {
  const match = uri.match(/^mongodb\+srv:\/\/(?:[^@]+@)?([^/?]+)/i);
  return match?.[1] || '';
}

function sanitizeMongoError(error) {
  return {
    name: error?.name,
    message: error?.message,
    code: error?.code,
    reason: error?.reason?.message || undefined,
    hostname: error?.hostname || undefined,
    syscall: error?.syscall || undefined
  };
}

function shouldRetry(error) {
  if (!error) return true;
  const code = error.code || error.cause?.code;
  if (RETRYABLE_ERROR_CODES.has(code)) return true;
  const message = String(error.message || '');
  return (
    message.includes('querySrv') ||
    message.includes('server selection timed out') ||
    message.includes('getaddrinfo') ||
    message.includes('TopologyDescription') ||
    message.includes('MongoNetworkError') ||
    message.includes('MongoServerSelectionError')
  );
}

function registerConnectionEvents() {
  if (connectionEventsRegistered) {
    return;
  }

  connectionEventsRegistered = true;

  mongoose.connection.on('connecting', () => {
    logger.info({ database: getDatabaseStatus() }, 'MongoDB connecting');
  });

  mongoose.connection.on('connected', () => {
    logger.info({ database: getDatabaseStatus() }, 'MongoDB connected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info({ database: getDatabaseStatus() }, 'MongoDB reconnected');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn({ database: getDatabaseStatus() }, 'MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error({ error: sanitizeMongoError(error) }, 'MongoDB connection error');
  });
}

export function getDatabaseStatus() {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    connected: readyState === 1,
    readyState,
    status: states[readyState] ?? 'unknown'
  };
}

async function connectTarget(uri, label, retries) {
  const connectOptions = {
    autoIndex: env.NODE_ENV !== 'production',
    connectTimeoutMS: env.MONGODB_CONNECT_TIMEOUT_MS,
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    socketTimeoutMS: env.MONGODB_SOCKET_TIMEOUT_MS,
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
    family: 4
  };

  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      logger.info(
        {
          target: label,
          attempt,
          retries,
          uriType: isSrvUri(uri) ? 'srv' : 'standard'
        },
        'Connecting to MongoDB'
      );

      await mongoose.connect(uri, connectOptions);

      return mongoose.connection;
    } catch (error) {
      lastError = error;

      const retryable = shouldRetry(error);
      const finalAttempt = attempt >= retries;
      logger.warn(
        {
          target: label,
          attempt,
          retries,
          retryable,
          error: sanitizeMongoError(error)
        },
        finalAttempt ? 'MongoDB connection attempt failed' : 'MongoDB connection attempt failed; will retry'
      );

      if (finalAttempt || !retryable) {
        break;
      }

      const delay = getBackoffDelay(attempt);
      logger.info({ target: label, delay }, 'Waiting before next MongoDB retry');
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function connectDatabase(options = {}) {
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);
  registerConnectionEvents();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const allowDegradedMode = options.allowDegradedMode ?? env.MONGODB_ALLOW_DEGRADED_MODE;
  const degradedMessage = env.MONGODB_ALLOW_DEGRADED_MODE
    ? 'MongoDB connection failed; continuing in degraded mode because MONGODB_ALLOW_DEGRADED_MODE is enabled'
    : 'MongoDB connection failed; set MONGODB_ALLOW_DEGRADED_MODE=true to keep the API running without the database';
  const retries = options.retries ?? env.MONGODB_MAX_RETRIES;
  const targets = [
    { uri: env.MONGODB_URI, label: 'primary' }
  ];

  if (env.MONGODB_DIRECT_URI && env.MONGODB_DIRECT_URI !== env.MONGODB_URI) {
    targets.push({ uri: env.MONGODB_DIRECT_URI, label: 'direct' });
  }

  connectionPromise = (async () => {
    let lastError = null;

    for (const target of targets) {
      try {
        return await connectTarget(target.uri, target.label, retries);
      } catch (error) {
        lastError = error;
        logger.error(
          {
            target: target.label,
            error: sanitizeMongoError(error)
          },
          'MongoDB target failed'
        );
      }
    }

    if (allowDegradedMode) {
      logger.warn(
        {
          database: getDatabaseStatus(),
          allowDegradedMode
        },
        degradedMessage
      );
      return null;
    }

    throw lastError || new Error('MongoDB connection failed');
  })().catch((error) => {
    connectionPromise = null;
    throw error;
  });

  return connectionPromise;
}

export async function disconnectDatabase() {
  connectionPromise = null;
  if (mongoose.connection.readyState === 0) {
    return;
  }
  await mongoose.disconnect();
}
