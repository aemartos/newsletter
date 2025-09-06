import express from 'express';
import { prismaClient } from '../../prisma/prisma.js';

const router: express.Router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    const existingSubscriber = await prismaClient.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        error: 'Email already subscribed',
        message: 'This email is already subscribed to our newsletter',
      });
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
  } catch (error) {
    throw new Error(
      `Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

export default router;
