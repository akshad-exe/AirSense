import { Router } from 'express';
import { receiveDistance } from '../controllers/distance.controller';
import { apiLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * POST /api/distance
 * Receive distance data from ultrasonic sensor
 */
router.post('/distance', apiLimiter, receiveDistance);

export default router;
