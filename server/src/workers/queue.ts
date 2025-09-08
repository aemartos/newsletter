import type { Job } from 'pg-boss';
import { jobProcessor } from '../lib/jobs/index.js';

/**
 * Register one worker on a queue using the batch API with batchSize: 1.
 * The pg-boss handler receives Job<T>[], we forward jobs[0] for a single-job handler.
 */
export async function workBatch<T>(
  queueName: string,
  handler: (job: Job<T>) => Promise<void> | void
): Promise<string> {
  return jobProcessor.work<T>(queueName, { batchSize: 1 }, async jobs => {
    const job = jobs[0];
    if (!job) return;
    await handler(job);
  });
}

/**
 * Start N workers on a queue, each using batchSize: 1.
 * Concurrency = N (one job per worker at a time).
 */
export async function startWorkersBatch<T>(
  queueName: string,
  count: number,
  handler: (job: Job<T>) => Promise<void> | void
): Promise<void> {
  await Promise.all(
    Array.from({ length: count }).map(() => workBatch<T>(queueName, handler))
  );
}
