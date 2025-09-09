import { Queues, jobProcessor } from '../lib/jobs/index.js';
import {
  prismaClient,
  Prisma,
  Subscriber,
  PostStatus,
  DeliveryStatus,
} from '../prisma.js';
import { sendEmail } from '../providers/email.js';
import { workBatch, startWorkersBatch } from './queue.js';
import { config } from '../config/index.js';
import { SEND_WORKERS } from './consts.js';

export async function registerNewsletterWorkers(): Promise<void> {
  // A) Publish: single worker, batchSize:1
  await workBatch<{ slug: string }>(
    Queues.NEWSLETTER.PUBLISH_POST,
    async job => {
      const { slug } = job.data;

      const post = await prismaClient.post.findUnique({ where: { slug } });
      if (!post) return;

      await prismaClient.$transaction(async (tx: Prisma.TransactionClient) => {
        if (post.status !== PostStatus.PUBLISHED) {
          await tx.post.update({
            where: { id: post.id },
            data: {
              status: PostStatus.PUBLISHED,
              publishedAt: new Date(),
            },
          });
        }

        const subs = await tx.subscriber.findMany({
          where: { subscribed: true },
        });

        if (subs.length) {
          await tx.emailDelivery.createMany({
            data: subs.map((s: Subscriber) => ({
              postId: post.id,
              subscriberId: s.id,
            })),
            skipDuplicates: true,
          });
        }

        if (!subs.length) return;

        await jobProcessor.insert(
          subs.map((s: Subscriber) => ({
            name: Queues.NEWSLETTER.SEND_EMAIL,
            data: { slug, subscriberId: s.id },
            options: {
              retryLimit: 10,
              retryBackoff: true,
              retryDelay: 10,
              singletonKey: `send:${slug}:${s.id}`,
            },
          }))
        );
      });
    }
  );

  // B) Send: N workers, each batchSize:1
  await startWorkersBatch<{ slug: string; subscriberId: string }>(
    Queues.NEWSLETTER.SEND_EMAIL,
    SEND_WORKERS,
    async job => {
      const { slug, subscriberId } = job.data;

      const post = await prismaClient.post.findUnique({ where: { slug } });
      if (!post) return;

      const delivery = await prismaClient.emailDelivery.findUnique({
        where: { postId_subscriberId: { postId: post.id, subscriberId } },
        include: { post: true, subscriber: true },
      });
      if (
        !delivery ||
        ![DeliveryStatus.PENDING, DeliveryStatus.FAILED].includes(
          delivery.status
        )
      )
        return;

      try {
        // TODO(Ana): search for a provider with idempotency keys -> https://resend.com/migrate/sendgrid#idempotency-keys
        await sendEmail({
          email: delivery.subscriber.email,
          templateId: config.email.templateId,
          dynamic_template_data: {
            post_url: `${config.clientUrl}/post/${slug}`,
            title: delivery.post.title,
            excerpt: delivery.post.excerpt,
          },
        });

        await prismaClient.emailDelivery.update({
          where: { id: delivery.id },
          data: {
            status: DeliveryStatus.SENT,
            sentAt: new Date(),
          },
        });
      } catch (err) {
        await prismaClient.emailDelivery.update({
          where: { id: delivery.id },
          data: { status: DeliveryStatus.FAILED, lastError: String(err) },
        });
        throw err; // retry with backoff
      }
    }
  );
}
