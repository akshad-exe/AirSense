import db from '../config/database';
import { Device, DeviceInput, DeviceWithLatestReading } from '../types/device';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

/**
 * Generate a secure API key for a device
 */
export function generateApiKey(): string {
    return uuidv4().replace(/-/g, '');
}

/**
 * Find device by API key
 */
export function findByApiKey(apiKey: string): Device | null {
    try {
        const stmt = db.prepare('SELECT * FROM devices WHERE api_key = ?');
        const device = stmt.get(apiKey) as Device | undefined;
        return device || null;
    } catch (error) {
        logger.error('Error finding device by API key:', error);
        return null;
    }
}

/**
 * Find device by device ID
 */
export function findById(deviceId: string): Device | null {
    try {
        const stmt = db.prepare('SELECT * FROM devices WHERE device_id = ?');
        const device = stmt.get(deviceId) as Device | undefined;
        return device || null;
    } catch (error) {
        logger.error('Error finding device by ID:', error);
        return null;
    }
}

/**
 * Register a new device
 */
export function registerDevice(input: DeviceInput): Device {
    try {
        const apiKey = generateApiKey();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
      INSERT INTO devices (device_id, api_key, location, status, created_at, updated_at)
      VALUES (?, ?, ?, 'offline', ?, ?)
    `);

        stmt.run(input.device_id, apiKey, input.location || null, now, now);

        logger.info(`Device registered: ${input.device_id}`);

        return {
            device_id: input.device_id,
            api_key: apiKey,
            location: input.location,
            status: 'offline',
            created_at: now,
            updated_at: now
        };
    } catch (error) {
        logger.error('Error registering device:', error);
        throw new Error('Failed to register device');
    }
}

/**
 * Update device last_seen timestamp
 */
export function updateLastSeen(deviceId: string): void {
    try {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
      UPDATE devices 
      SET last_seen = ?, status = 'online', updated_at = ?
      WHERE device_id = ?
    `);

        stmt.run(now, now, deviceId);
    } catch (error) {
        logger.error('Error updating device last_seen:', error);
    }
}

/**
 * Update device status
 */
export function updateStatus(deviceId: string, status: 'online' | 'offline'): void {
    try {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
      UPDATE devices 
      SET status = ?, updated_at = ?
      WHERE device_id = ?
    `);

        stmt.run(status, now, deviceId);
        logger.info(`Device ${deviceId} status updated to ${status}`);
    } catch (error) {
        logger.error('Error updating device status:', error);
    }
}

/**
 * Get all devices
 */
export function getAllDevices(): Device[] {
    try {
        const stmt = db.prepare('SELECT * FROM devices ORDER BY created_at DESC');
        return stmt.all() as Device[];
    } catch (error) {
        logger.error('Error getting all devices:', error);
        return [];
    }
}

/**
 * Get device with latest reading
 */
export function getDeviceWithLatestReading(deviceId: string): DeviceWithLatestReading | null {
    try {
        const device = findById(deviceId);
        if (!device) return null;

        const stmt = db.prepare(`
      SELECT pm25, pm10, aqi, air_quality_level, timestamp
      FROM air_readings
      WHERE device_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `);

        const latestReading = stmt.get(deviceId) as any;

        return {
            ...device,
            latest_reading: latestReading || undefined
        };
    } catch (error) {
        logger.error('Error getting device with latest reading:', error);
        return null;
    }
}

/**
 * Check and update offline devices
 */
export function checkOfflineDevices(threshold: number = 60000): void {
    try {
        const cutoffTime = new Date(Date.now() - threshold).toISOString();

        const stmt = db.prepare(`
      UPDATE devices
      SET status = 'offline', updated_at = ?
      WHERE status = 'online' 
      AND (last_seen IS NULL OR last_seen < ?)
    `);

        const result = stmt.run(new Date().toISOString(), cutoffTime);

        if (result.changes > 0) {
            logger.info(`Marked ${result.changes} devices as offline`);
        }
    } catch (error) {
        logger.error('Error checking offline devices:', error);
    }
}
