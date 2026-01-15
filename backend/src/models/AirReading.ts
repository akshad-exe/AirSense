import db from '../config/database';
import { AirReading } from '../types/airData';
import logger from '../utils/logger';

/**
 * AirReading Model
 * Handles database operations for air quality readings
 */
export class AirReadingModel {
    /**
     * Create a new air reading
     */
    static create(data: Omit<AirReading, 'id' | 'timestamp'>): AirReading {
        try {
            const stmt = db.prepare(`
        INSERT INTO air_readings (device_id, pm25, pm10, aqi, air_quality_level)
        VALUES (?, ?, ?, ?, ?)
      `);

            const result = stmt.run(
                data.device_id,
                data.pm25,
                data.pm10,
                data.aqi,
                data.air_quality_level
            );

            return {
                id: Number(result.lastInsertRowid),
                ...data,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Error creating air reading:', error);
            throw error;
        }
    }

    /**
     * Find reading by ID
     */
    static findById(id: number): AirReading | null {
        try {
            const stmt = db.prepare('SELECT * FROM air_readings WHERE id = ?');
            return stmt.get(id) as AirReading | null;
        } catch (error) {
            logger.error('Error finding air reading:', error);
            return null;
        }
    }

    /**
     * Find latest reading for a device
     */
    static findLatestByDevice(deviceId: string): AirReading | null {
        try {
            const stmt = db.prepare(`
        SELECT * FROM air_readings 
        WHERE device_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
      `);
            return stmt.get(deviceId) as AirReading | null;
        } catch (error) {
            logger.error('Error finding latest reading:', error);
            return null;
        }
    }

    /**
     * Find all readings with filters
     */
    static findAll(filters: {
        deviceId?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }): AirReading[] {
        try {
            let query = 'SELECT * FROM air_readings WHERE 1=1';
            const params: any[] = [];

            if (filters.deviceId) {
                query += ' AND device_id = ?';
                params.push(filters.deviceId);
            }

            if (filters.startDate) {
                query += ' AND timestamp >= ?';
                params.push(filters.startDate);
            }

            if (filters.endDate) {
                query += ' AND timestamp <= ?';
                params.push(filters.endDate);
            }

            query += ' ORDER BY timestamp DESC';

            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(filters.limit);
            }

            if (filters.offset) {
                query += ' OFFSET ?';
                params.push(filters.offset);
            }

            const stmt = db.prepare(query);
            return stmt.all(...params) as AirReading[];
        } catch (error) {
            logger.error('Error finding air readings:', error);
            return [];
        }
    }

    /**
     * Count readings with filters
     */
    static count(filters: {
        deviceId?: string;
        startDate?: string;
        endDate?: string;
    }): number {
        try {
            let query = 'SELECT COUNT(*) as count FROM air_readings WHERE 1=1';
            const params: any[] = [];

            if (filters.deviceId) {
                query += ' AND device_id = ?';
                params.push(filters.deviceId);
            }

            if (filters.startDate) {
                query += ' AND timestamp >= ?';
                params.push(filters.startDate);
            }

            if (filters.endDate) {
                query += ' AND timestamp <= ?';
                params.push(filters.endDate);
            }

            const stmt = db.prepare(query);
            const result = stmt.get(...params) as { count: number };
            return result.count;
        } catch (error) {
            logger.error('Error counting air readings:', error);
            return 0;
        }
    }

    /**
     * Delete old readings (for cleanup)
     */
    static deleteOlderThan(date: string): number {
        try {
            const stmt = db.prepare('DELETE FROM air_readings WHERE timestamp < ?');
            const result = stmt.run(date);
            return result.changes;
        } catch (error) {
            logger.error('Error deleting old readings:', error);
            return 0;
        }
    }

    /**
     * Get statistics for a device
     */
    static getStatistics(deviceId: string, hours: number = 24) {
        try {
            const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

            const stmt = db.prepare(`
        SELECT 
          COUNT(*) as count,
          AVG(aqi) as avg_aqi,
          MIN(aqi) as min_aqi,
          MAX(aqi) as max_aqi,
          AVG(pm25) as avg_pm25,
          AVG(pm10) as avg_pm10
        FROM air_readings
        WHERE device_id = ? AND timestamp >= ?
      `);

            return stmt.get(deviceId, since);
        } catch (error) {
            logger.error('Error getting statistics:', error);
            return null;
        }
    }
}

export default AirReadingModel;
