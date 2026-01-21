import { Request, Response } from 'express';
import { ApiResponse } from '../types/api';
import logger from '../utils/logger';

/**
 * POST /api/distance
 * Receive distance data from ultrasonic sensor
 */
export async function receiveDistance(
    req: Request,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const { distance_cm } = req.body;

        // Validation
        if (
            distance_cm === undefined ||
            typeof distance_cm !== 'number' ||
            distance_cm < 0
        ) {
            res.status(400).json({
                success: false,
                error: 'distance_cm must be a positive number'
            });
            return;
        }

        // Log data (can be replaced with DB storage)
        logger.info(`📏 Distance received: ${distance_cm} cm`);

        res.status(200).json({
            success: true,
            data: {
                distance_cm,
                unit: 'cm',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error('Error in receiveDistance:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process distance data'
        });
    }
}
