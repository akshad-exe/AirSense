import { Router } from 'express';
import { getHistory } from '../controllers/history.controller';
import { validateHistoryQuery } from '../middleware/validation.middleware';
import { apiLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * GET /api/history
 * Get historical AQI data
 */
router.get('/history', apiLimiter, validateHistoryQuery, getHistory);

export default router;
