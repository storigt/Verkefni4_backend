import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';

import { QuestionCreateSchema } from '../schema.zod.js';

export const questionsApi = new Hono();

const prisma = new PrismaClient();

questionsApi.get('/', async (c) => {
  const questions = await prisma.question.findMany();
  return c.json(questions);
});

questionsApi.get('/:id', async (c) => {
  const id = c.req.param('id');
  const question = await prisma.question.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      answers: true,
      category: true,
    },
  });

  if (!question) {
    return c.json({ message: 'question not found' }, 404);
  }

  return c.json(question);
});

questionsApi.post('/', zValidator('json', QuestionCreateSchema), async (c) => {
  const question = c.req.valid('json');

  const savedQuestion = await prisma.question.create({
    data: {
      text: question.text,
      categoryId: question.categoryId,
      answers: {
        create: question.answers,
      },
    },
    include: {
      answers: true,
      category: true,
    },
  });

  return c.json(savedQuestion, 201);
});

questionsApi.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const question = await prisma.question.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!question) {
    return c.json({ message: 'question not found' }, 404);
  }

  await prisma.answer.deleteMany({
    where: {
      questionId: Number(id),
    },
  });

  await prisma.question.delete({
    where: {
      id: Number(id),
    },
  });

  return c.json({ message: 'question deleted' });
});

questionsApi.patch(
  '/:id',
  /* todo */
);
