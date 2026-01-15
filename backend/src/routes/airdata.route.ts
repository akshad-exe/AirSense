import { Router } from 'express';
import { postAirData, getLatest } from '../controllers/airdata.controller';
import { authenticateDevice } from '../middleware/auth.middleware';
import { validateAirData } from '../middleware/validation.middleware';
import { sensorDataLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * POST /api/air-data
 * Receive sensor data from ESP32 devices
 */
router.post(
    '/air-data',
    sensorDataLimiter,
    validateAirData,
    authenticateDevice,
    postAirData
);

/**
 * GET /api/latest
 * Get latest AQI reading
 */
router.get('/latest', getLatest);

export default router;
