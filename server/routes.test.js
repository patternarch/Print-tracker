import test from 'node:test';
import assert from 'node:assert';
import express from 'express';
import request from 'supertest';
import { registerRoutes } from './routes.js';
import { storage } from './storage.js';

test('GET /api/print-logs returns logs', async (t) => {
  const app = express();
  app.use(express.json());
  storage.getPrintLogs = async () => [{ id: 1 }];
  const server = await registerRoutes(app);

  const res = await request(server).get('/api/print-logs');
  assert.equal(res.statusCode, 200);
  assert.deepStrictEqual(res.body, [{ id: 1 }]);

  server.close();
  t.pass();
});
