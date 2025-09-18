import express from 'express';
import { prismaClient } from '../prisma.js';
import { validate, subscriberSchema } from '../validation/index.js';
import { asyncHandler } from '../lib/errors/middlewares.js';
import { ConflictError } from '../lib/errors/index.js';

const router: express.Router = express.Router();

router.post(
  '/',
  validate(subscriberSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingSubscriber = await prismaClient.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber && existingSubscriber.subscribed) {
      throw new ConflictError(
        'This email is already subscribed to our newsletter'
      );
    }

    const subscriber = await prismaClient.subscriber.upsert({
      where: { email },
      update: { subscribed: true },
      create: { email, subscribed: true },
    });

    res.status(201).json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        subscribedAt: subscriber.createdAt,
      },
      message: 'Successfully subscribed to the newsletter!',
    });
  })
);

router.post(
  '/unsubscribe',
  validate(subscriberSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const subscriber = await prismaClient.subscriber.upsert({
      where: { email },
      update: { subscribed: false },
      create: { email, subscribed: false },
    });

    res.status(200).json({
      success: true,
      data: {
        id: subscriber.id,
        email: subscriber.email,
        subscribed: subscriber.subscribed,
      },
      message: 'Successfully unsubscribed from the newsletter!',
    });
  })
);

export default router;
