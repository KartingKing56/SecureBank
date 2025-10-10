import { Router } from 'express';
import { health } from './health';
import { auth } from './auth';

//--------------------------------------
// backend api routes.
//--------------------------------------
export const routes = Router();
routes.use(health);
routes.use(auth);