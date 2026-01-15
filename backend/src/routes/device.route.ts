import { Router } from 'express';
import { getDevices, getDevice, registerNewDevice } from '../controllers/device.controller';
import { validateDeviceRegistration } from '../middleware/validation.middleware';
import { apiLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * GET /api/devices
 * Get all devices
 */
router.get('/devices', apiLimiter, getDevices);

/**
 * GET /api/devices/:deviceId
 * Get specific device
 */
router.get('/devices/:deviceId', apiLimiter, getDevice);

/**
 * POST /api/devices/register
 * Register a new device
 */
router.post('/devices/register', validateDeviceRegistration, registerNewDevice);

export default router;
