import PgBoss from 'pg-boss';
import { config } from '../../config';

export const Queues = {
  NEWSLETTER: {
    PUBLISH_POST: 'newsletter.publish-post',
    SEND_EMAIL: 'newsletter.send-email',
  },
};

export const jobProcessor = new PgBoss({
  connectionString: config.databaseUrl,
  // schema: 'pgboss', // by default
});

export async function startJobProcessor() {
  jobProcessor.on('error', err => console.error('[pg-boss] error', err));
  await jobProcessor.start();
  await jobProcessor.createQueue(Queues.NEWSLETTER.PUBLISH_POST);
  await jobProcessor.createQueue(Queues.NEWSLETTER.SEND_EMAIL);
}

export async function stopJobProcessor() {
  try {
    await jobProcessor.stop();
  } catch {
    console.error('[pg-boss] error stopping');
  }
}
