import db from '../config/database';
import { Device } from '../types/device';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

/**
 * Device Model
 * Handles database operations for IoT devices
 */
export class DeviceModel {
    /**
     * Create a new device
     */
    static create(data: {
        device_id: string;
        location?: string;
        api_key?: string;
    }): Device {
        try {
            const apiKey = data.api_key || uuidv4().replace(/-/g, '');
            const now = new Date().toISOString();

            const stmt = db.prepare(`
        INSERT INTO devices (device_id, api_key, location, status, created_at, updated_at)
        VALUES (?, ?, ?, 'offline', ?, ?)
      `);

            stmt.run(data.device_id, apiKey, data.location || null, now, now);

            return {
                device_id: data.device_id,
                api_key: apiKey,
                location: data.location,
                status: 'offline',
                created_at: now,
                updated_at: now
            };
        } catch (error) {
            logger.error('Error creating device:', error);
            throw error;
        }
    }

    /**
     * Find device by ID
     */
    static findById(deviceId: string): Device | null {
        try {
            const stmt = db.prepare('SELECT * FROM devices WHERE device_id = ?');
            return stmt.get(deviceId) as Device | null;
        } catch (error) {
            logger.error('Error finding device by ID:', error);
            return null;
        }
    }

    /**
     * Find device by API key
     */
    static findByApiKey(apiKey: string): Device | null {
        try {
            const stmt = db.prepare('SELECT * FROM devices WHERE api_key = ?');
            return stmt.get(apiKey) as Device | null;
        } catch (error) {
            logger.error('Error finding device by API key:', error);
            return null;
        }
    }

    /**
     * Find all devices
     */
    static findAll(): Device[] {
        try {
            const stmt = db.prepare('SELECT * FROM devices ORDER BY created_at DESC');
            return stmt.all() as Device[];
        } catch (error) {
            logger.error('Error finding all devices:', error);
            return [];
        }
    }

    /**
     * Update device
     */
    static update(deviceId: string, data: Partial<Device>): boolean {
        try {
            const updates: string[] = [];
            const params: any[] = [];

            if (data.location !== undefined) {
                updates.push('location = ?');
                params.push(data.location);
            }

            if (data.status !== undefined) {
                updates.push('status = ?');
                params.push(data.status);
            }

            if (data.last_seen !== undefined) {
                updates.push('last_seen = ?');
                params.push(data.last_seen);
            }

            if (updates.length === 0) return false;

            updates.push('updated_at = ?');
            params.push(new Date().toISOString());
            params.push(deviceId);

            const query = `UPDATE devices SET ${updates.join(', ')} WHERE device_id = ?`;
            const stmt = db.prepare(query);
            const result = stmt.run(...params);

            return result.changes > 0;
        } catch (error) {
            logger.error('Error updating device:', error);
            return false;
        }
    }

    /**
     * Update last seen timestamp
     */
    static updateLastSeen(deviceId: string): boolean {
        try {
            const now = new Date().toISOString();
            const stmt = db.prepare(`
        UPDATE devices 
        SET last_seen = ?, status = 'online', updated_at = ?
        WHERE device_id = ?
      `);

            const result = stmt.run(now, now, deviceId);
            return result.changes > 0;
        } catch (error) {
            logger.error('Error updating last seen:', error);
            return false;
        }
    }

    /**
     * Update device status
     */
    static updateStatus(deviceId: string, status: 'online' | 'offline'): boolean {
        try {
            const now = new Date().toISOString();
            const stmt = db.prepare(`
        UPDATE devices 
        SET status = ?, updated_at = ?
        WHERE device_id = ?
      `);

            const result = stmt.run(status, now, deviceId);
            return result.changes > 0;
        } catch (error) {
            logger.error('Error updating status:', error);
            return false;
        }
    }

    /**
     * Mark offline devices
     */
    static markOfflineDevices(thresholdMs: number): number {
        try {
            const cutoffTime = new Date(Date.now() - thresholdMs).toISOString();
            const now = new Date().toISOString();

            const stmt = db.prepare(`
        UPDATE devices
        SET status = 'offline', updated_at = ?
        WHERE status = 'online' 
        AND (last_seen IS NULL OR last_seen < ?)
      `);

            const result = stmt.run(now, cutoffTime);
            return result.changes;
        } catch (error) {
            logger.error('Error marking offline devices:', error);
            return 0;
        }
    }

    /**
     * Delete device
     */
    static delete(deviceId: string): boolean {
        try {
            const stmt = db.prepare('DELETE FROM devices WHERE device_id = ?');
            const result = stmt.run(deviceId);
            return result.changes > 0;
        } catch (error) {
            logger.error('Error deleting device:', error);
            return false;
        }
    }

    /**
     * Check if device exists
     */
    static exists(deviceId: string): boolean {
        try {
            const stmt = db.prepare('SELECT 1 FROM devices WHERE device_id = ? LIMIT 1');
            return stmt.get(deviceId) !== undefined;
        } catch (error) {
            logger.error('Error checking device existence:', error);
            return false;
        }
    }

    /**
     * Get online devices count
     */
    static getOnlineCount(): number {
        try {
            const stmt = db.prepare("SELECT COUNT(*) as count FROM devices WHERE status = 'online'");
            const result = stmt.get() as { count: number };
            return result.count;
        } catch (error) {
            logger.error('Error getting online count:', error);
            return 0;
        }
    }
}

export default DeviceModel;
