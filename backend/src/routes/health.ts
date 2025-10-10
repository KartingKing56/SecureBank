import { Router } from 'express';
export const health = Router();

//--------------------------------------
// api health route for backend server.
//--------------------------------------
health.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});