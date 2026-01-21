import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Validation schema for air data input
 * DHT22: temperature, humidity
 * MQ135: air_quality_ppm
 */
const airDataSchema = Joi.object({
    device_id: Joi.string().required().min(3).max(100),
    temperature: Joi.number().required().min(-40).max(80),     // DHT22 range
    humidity: Joi.number().required().min(0).max(100),          // DHT22 range
    air_quality_ppm: Joi.number().required().min(0).max(1000), // MQ135 range
    api_key: Joi.string().optional() // Can be in header or body
});

/**
 * Validation schema for device registration
 */
const deviceRegistrationSchema = Joi.object({
    device_id: Joi.string().required().min(3).max(100),
    location: Joi.string().optional().max(200)
});

/**
 * Validation schema for history query
 */
const historyQuerySchema = Joi.object({
    device_id: Joi.string().optional(),
    start_date: Joi.string().isoDate().optional(),
    end_date: Joi.string().isoDate().optional(),
    limit: Joi.number().integer().min(1).max(1000).optional(),
    offset: Joi.number().integer().min(0).optional()
});

/**
 * Generic validation middleware factory
 */
export function validate(schema: Joi.ObjectSchema, property: 'body' | 'query' = 'body') {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            logger.warn('Validation error:', errors);

            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
            return;
        }

        // Replace request data with validated data
        req[property] = value;
        next();
    };
}

/**
 * Middleware to validate air data input
 */
export const validateAirData = validate(airDataSchema, 'body');

/**
 * Middleware to validate device registration
 */
export const validateDeviceRegistration = validate(deviceRegistrationSchema, 'body');

/**
 * Middleware to validate history query
 */
export const validateHistoryQuery = validate(historyQuerySchema, 'query');
