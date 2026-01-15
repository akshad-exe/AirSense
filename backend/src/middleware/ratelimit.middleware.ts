import rateLimit from 'express-rate-limit';
import { DEFAULTS } from '../config/constants';

/**
 * Rate limiter for sensor data endpoints
 * Limits to 60 requests per minute (1 per second)
 */
export const sensorDataLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || String(DEFAULTS.RATE_LIMIT_WINDOW)),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || String(DEFAULTS.RATE_LIMIT_MAX_REQUESTS)),
    message: {
        success: false,
        error: 'Too many requests from this device, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for general API endpoints
 * Limits to 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW || String(DEFAULTS.API_RATE_LIMIT_WINDOW)),
    max: parseInt(process.env.API_RATE_LIMIT_MAX || String(DEFAULTS.API_RATE_LIMIT_MAX)),
    message: {
        success: false,
        error: 'Too many API requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
