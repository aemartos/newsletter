import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequestHandler } from '@react-router/express';
import { prismaClient } from './prisma.js';
import { startJobProcessor, stopJobProcessor } from './lib/jobs/index.js';
import { registerWorkers } from './workers/index.js';
import { config } from './config/index.js';
import postsRouter from './routes/posts.js';
import subscribersRouter from './routes/subscribers.js';
import healthRouter from './routes/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.port;

app.use(helmet(config.helmet));
app.use(compression());
app.use(morgan('combined'));
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

/**
 * !IMPORTANT:
 * Do NOT mount `express.json()` or `express.urlencoded()` globally.
 * React Router server actions (`await request.formData()`) need access
 * to the raw request body stream. If global body parsers are used,
 * they will consume the stream before React Router can read it,
 * resulting in empty `{}` formData and null fields.
 *
 * Instead, scope body parsers only to `/api` routes,
 * where you explicitly want to handle JSON or urlencoded requests.
 */
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// ---- Static client assets (served before SSR) ----
const clientAssetsDir = path.resolve(__dirname, '../../client/build/client');
const serverBundlePath = path.resolve(
  __dirname,
  '../../client/build/server/index.js'
);

app.use(
  '/assets',
  express.static(path.join(clientAssetsDir, 'assets'), {
    immutable: true,
    maxAge: '1y',
  })
);

app.use(
  '/images',
  express.static(path.join(clientAssetsDir, 'images'), {
    maxAge: '1d',
  })
);

// Handle root favicon.ico requests - serve light favicon as default
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(clientAssetsDir, 'favicon', 'light', 'favicon.ico'));
});

// ---- Health check route (no body parser needed) ----
app.use('/health', healthRouter);

// ---- API routes (with body parsers scoped to /api) ----
app.use('/api', express.json({ limit: '10mb' }));
app.use('/api', express.urlencoded({ extended: true }));

app.use('/api/posts', postsRouter);
app.use('/api/subscribers', subscribersRouter);

// TODO: improve error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message:
        config.nodeEnv === 'development' ? err.message : 'Something went wrong',
    });
  }
);

// ---- React Router SSR handler LAST ----
const requestHandler = createRequestHandler({
  // Import the built server bundle at runtime; use file URL for absolute path safety
  build: () => import(pathToFileURL(serverBundlePath).href),
  mode: config.nodeEnv,
});

// Handle all non-API routes with React Router SSR
app.all('*', (req, res, next) => {
  // Don't handle API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      message: 'The requested API endpoint was not found',
    });
  }

  return requestHandler(req, res, next);
});

// Handles Ctrl+C to stop the server
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await stopJobProcessor();
  await prismaClient.$disconnect();
  process.exit(0);
});

// Handles when PM2/Render sends a termination signal
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await stopJobProcessor();
  await prismaClient.$disconnect();
  process.exit(0);
});

startJobProcessor()
  .then(registerWorkers)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
      console.log(`[pg-boss] ready`);
    });
  })
  .catch(e => {
    console.error('[pg-boss] failed to start', e);
    process.exit(1);
  });
