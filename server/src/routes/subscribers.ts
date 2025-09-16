import express from 'express';
import { prismaClient } from '../prisma.js';
import { validate, createSubscriberSchema } from '../validation/index.js';
import { asyncHandler } from '../lib/errors/middlewares.js';
import { ConflictError } from '../lib/errors/index.js';

const router: express.Router = express.Router();

router.post(
  '/',
  validate(createSubscriberSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingSubscriber = await prismaClient.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      throw new ConflictError(
        'This email is already subscribed to our newsletter'
      );
    }

    const subscriber = await prismaClient.subscriber.create({
      data: { email },
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

export default router;
