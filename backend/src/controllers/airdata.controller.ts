import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/api';
import { storeReading, getLatestReading } from '../services/data.service';
import { broadcastAQIUpdate } from '../services/websocket.service';
import logger from '../utils/logger';

/**
 * POST /api/air-data
 * Receive sensor data from ESP32 devices
 * Expects: temperature (DHT22), humidity (DHT22), air_quality_ppm (MQ135)
 */
export async function postAirData(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const { device_id, temperature, humidity, air_quality_ppm } = req.body;

        // Verify device_id matches authenticated device
        if (req.device && req.device.device_id !== device_id) {
            res.status(403).json({
                success: false,
                error: 'Device ID mismatch'
            });
            return;
        }

        // Store the reading
        const reading = storeReading({ device_id, temperature, humidity, air_quality_ppm });

        // Broadcast update via WebSocket
        broadcastAQIUpdate({
            device_id: reading.device_id,
            temperature: reading.temperature,
            humidity: reading.humidity,
            air_quality_ppm: reading.air_quality_ppm,
            aqi: reading.aqi,
            air_quality_level: reading.air_quality_level,
            timestamp: reading.timestamp
        });

        // Send response
        res.status(201).json({
            success: true,
            data: {
                id: reading.id,
                temperature: reading.temperature,
                humidity: reading.humidity,
                air_quality_ppm: reading.air_quality_ppm,
                aqi: reading.aqi,
                air_quality_level: reading.air_quality_level,
                timestamp: reading.timestamp
            }
        });
    } catch (error) {
        logger.error('Error in postAirData:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process air data'
        });
    }
}

/**
 * GET /api/latest
 * Get latest AQI reading
 */
export async function getLatest(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const deviceId = req.query.device_id as string | undefined;

        const reading = getLatestReading(deviceId);

        if (!reading) {
            res.status(404).json({
                success: false,
                error: 'No readings found'
            });
            return;
        }

        res.json({
            success: true,
            data: reading
        });
    } catch (error) {
        logger.error('Error in getLatest:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch latest reading'
        });
    }
}
