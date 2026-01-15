import { Request, Response } from 'express';
import { ApiResponse } from '../types/api';
import { getHistoricalReadings } from '../services/data.service';
import logger from '../utils/logger';

/**
 * GET /api/history
 * Get historical AQI data with pagination and filtering
 */
export async function getHistory(
    req: Request,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const {
            device_id,
            start_date,
            end_date,
            limit = 100,
            offset = 0
        } = req.query;

        const result = getHistoricalReadings({
            deviceId: device_id as string | undefined,
            startDate: start_date as string | undefined,
            endDate: end_date as string | undefined,
            limit: parseInt(limit as string) || 100,
            offset: parseInt(offset as string) || 0
        });

        const page = Math.floor((parseInt(offset as string) || 0) / (parseInt(limit as string) || 100)) + 1;

        res.json({
            success: true,
            data: {
                readings: result.readings,
                total: result.total,
                page,
                limit: parseInt(limit as string) || 100
            }
        });
    } catch (error) {
        logger.error('Error in getHistory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch historical data'
        });
    }
}
