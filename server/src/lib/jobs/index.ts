import PgBoss, { QueueResult } from 'pg-boss';
import { config } from '../../config/index.js';

export type { QueueResult };

export const Queues = {
  NEWSLETTER: {
    PUBLISH_POST: 'newsletter.publish-post',
    SEND_EMAIL: 'newsletter.send-email',
  },
};

export const jobProcessor = new PgBoss({
  connectionString: config.databaseUrl,
  // schema: 'pgboss', // default
});

export async function startJobProcessor() {
  jobProcessor.on('error', err => console.error('[pg-boss] error', err));
  try {
    await jobProcessor.start();
    await jobProcessor.createQueue(Queues.NEWSLETTER.PUBLISH_POST);
    await jobProcessor.createQueue(Queues.NEWSLETTER.SEND_EMAIL);
  } catch (error) {
    console.error('[pg-boss] Failed to start job processor:', error);
    throw error;
  }
}

export async function stopJobProcessor() {
  try {
    await jobProcessor.stop();
  } catch {
    console.error('[pg-boss] error stopping');
  }
}
