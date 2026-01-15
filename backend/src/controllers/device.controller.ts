import { Request, Response } from 'express';
import { ApiResponse } from '../types/api';
import {
    getAllDevices,
    getDeviceWithLatestReading,
    registerDevice,
    findById
} from '../services/device.service';
import logger from '../utils/logger';

/**
 * GET /api/devices
 * Get all registered devices
 */
export async function getDevices(
    _req: Request,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const devices = getAllDevices();

        res.json({
            success: true,
            data: {
                devices,
                total: devices.length
            }
        });
    } catch (error) {
        logger.error('Error in getDevices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch devices'
        });
    }
}

/**
 * GET /api/devices/:deviceId
 * Get specific device with latest reading
 */
export async function getDevice(
    req: Request,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const { deviceId } = req.params;

        const device = getDeviceWithLatestReading(deviceId);

        if (!device) {
            res.status(404).json({
                success: false,
                error: 'Device not found'
            });
            return;
        }

        res.json({
            success: true,
            data: device
        });
    } catch (error) {
        logger.error('Error in getDevice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch device'
        });
    }
}

/**
 * POST /api/devices/register
 * Register a new device
 */
export async function registerNewDevice(
    req: Request,
    res: Response<ApiResponse>
): Promise<void> {
    try {
        const { device_id, location } = req.body;

        // Check if device already exists
        const existingDevice = findById(device_id);
        if (existingDevice) {
            res.status(409).json({
                success: false,
                error: 'Device already registered'
            });
            return;
        }

        // Register the device
        const device = registerDevice({ device_id, location });

        res.status(201).json({
            success: true,
            data: {
                device_id: device.device_id,
                api_key: device.api_key,
                location: device.location,
                message: 'Device registered successfully. Please save the API key securely.'
            }
        });
    } catch (error) {
        logger.error('Error in registerNewDevice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to register device'
        });
    }
}
