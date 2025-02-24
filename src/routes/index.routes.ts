import { Hono } from 'hono';
import { categoriesApi } from './categories.routes.js';
import { questionsApi } from './questions.routes.js';

export const api = new Hono();

const routes = [
  {
    href: '/',
    methods: ['GET'],
  },
];

api.get('/', (c) => c.json(routes));
api.route('/categories', categoriesApi);
api.route('/questions', questionsApi);
