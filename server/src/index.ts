import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequestHandler } from '@react-router/express';
import { prismaClient } from '../prisma/prisma.js';
import postsRouter from './routes/posts.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/posts', postsRouter);

// TODO: improve error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong',
    });
  }
);

// Create React Router request handler for SSR
const buildPath = path.join(__dirname, '../../client/build');
const requestHandler = createRequestHandler({
  build: () => import(`${buildPath}/server/index.js`),
  mode: process.env.NODE_ENV || 'production',
});

// Serve static assets
app.use(
  express.static(path.join(buildPath, 'client'), {
    index: false, // Don't serve index.html for static assets
  })
);

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

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prismaClient.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});
