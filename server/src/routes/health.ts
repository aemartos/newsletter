import express from 'express';
import { prismaClient } from '../prisma.js';
import { QueueResult } from '../lib/jobs/index.js';

const router: express.Router = express.Router();

router.get('/', async (_req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: 'unknown',
      error: '',
    },
    pgBoss: {
      status: 'unknown',
      error: '',
      queueNames: [] as QueueResult[],
    },
  };

  let hasErrors = false;

  try {
    await prismaClient.$queryRaw`SELECT 1`;
    healthStatus.database = { status: 'connected', error: '' };
  } catch (error) {
    healthStatus.database = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    hasErrors = true;
  }

  try {
    const { jobProcessor } = await import('../lib/jobs/index.js');
    const queues = await jobProcessor.getQueues();
    healthStatus.pgBoss = {
      status: 'connected',
      error: '',
      queueNames: queues,
    };
  } catch (error) {
    healthStatus.pgBoss = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      queueNames: [],
    };
    hasErrors = true;
  }

  if (hasErrors) {
    healthStatus.status = 'error';
    res.status(503).json(healthStatus);
  } else {
    res.json(healthStatus);
  }
});

export default router;
