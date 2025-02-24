import { zValidator } from '@hono/zod-validator';
import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';

import { slugify } from '../lib/slugify.js';
import { CategoryCreateSchema } from '../schema.zod.js';

export const categoriesApi = new Hono();

const prisma = new PrismaClient();

categoriesApi.get('/', async (c) => {
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

categoriesApi.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const category = await prisma.category.findFirst({
    where: {
      slug,
    },
  });

  if (!category) {
    return c.json({ message: 'category not found' }, 404);
  }

  return c.json(category);
});

categoriesApi.post('/', zValidator('json', CategoryCreateSchema), async (c) => {
  const category = c.req.valid('json');

  // make sure we are not breaking the unique constraint
  const categoryExists = await prisma.category.findFirst({
    where: {
      name: category.name,
    },
  });

  if (categoryExists) {
    return c.json(categoryExists);
  }

  const savedCategory = await prisma.category.create({
    data: {
      name: category.name,
      slug: slugify(category.name),
    },
  });

  return c.json(savedCategory, 201);
});

categoriesApi.patch(
  '/:slug',
  zValidator('json', CategoryCreateSchema),
  async (c) => {
    const slug = c.req.param('slug');
    const category = c.req.valid('json');

    const categoryExists = await prisma.category.findFirst({
      where: {
        slug,
      },
    });

    if (!categoryExists) {
      return c.json({ message: 'category not found' }, 404);
    }

    const updatedCategory = await prisma.category.update({
      where: {
        slug,
      },
      data: {
        name: category.name,
        slug: slugify(category.name),
      },
    });

    return c.json(updatedCategory);
  },
);

categoriesApi.delete('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const categoryExists = await prisma.category.findFirst({
    where: {
      slug,
    },
  });

  if (!categoryExists) {
    return c.json({ message: 'category not found' }, 404);
  }

  await prisma.category.delete({
    where: {
      slug,
    },
  });

  return c.json({ message: 'category deleted' });
});
