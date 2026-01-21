import db from '../config/database';
import { AirReading, AirReadingInput, AirReadingWithDevice } from '../types/airData';
import { getAQIInfo } from './aqi.service';
import { updateLastSeen } from './device.service';
import logger from '../utils/logger';

/**
 * Store a new air quality reading
 */
export function storeReading(input: Omit<AirReadingInput, 'api_key'>): AirReading {
    try {
        const { device_id, temperature, humidity, air_quality_ppm } = input;

        // Calculate AQI from MQ135 PPM
        const aqiInfo = getAQIInfo(temperature, humidity, air_quality_ppm);

        // Store in database
        const stmt = db.prepare(`
      INSERT INTO air_readings (device_id, temperature, humidity, air_quality_ppm, aqi, air_quality_level)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            device_id,
            temperature,
            humidity,
            air_quality_ppm,
            aqiInfo.aqi,
            aqiInfo.level
        );

        // Update device last_seen
        updateLastSeen(device_id);

        // Get the inserted reading
        const reading: AirReading = {
            id: Number(result.lastInsertRowid),
            device_id,
            temperature,
            humidity,
            air_quality_ppm,
            aqi: aqiInfo.aqi,
            air_quality_level: aqiInfo.level,
            timestamp: new Date().toISOString()
        };

        logger.info(`Stored reading for device ${device_id}: AQI ${aqiInfo.aqi} (Temp: ${temperature}°C, Humidity: ${humidity}%, PPM: ${air_quality_ppm})`);

        return reading;
    } catch (error) {
        logger.error('Error storing reading:', error);
        throw new Error('Failed to store reading');
    }
}

/**
 * Get latest reading (optionally filtered by device)
 */
export function getLatestReading(deviceId?: string): AirReadingWithDevice | null {
    try {
        let query = `
      SELECT 
        ar.*,
        d.location,
        d.status as device_status
      FROM air_readings ar
      JOIN devices d ON ar.device_id = d.device_id
    `;

        const params: any[] = [];

        if (deviceId) {
            query += ' WHERE ar.device_id = ?';
            params.push(deviceId);
        }

        query += ' ORDER BY ar.timestamp DESC LIMIT 1';

        const stmt = db.prepare(query);
        const reading = stmt.get(...params) as AirReadingWithDevice | undefined;

        return reading || null;
    } catch (error) {
        logger.error('Error getting latest reading:', error);
        return null;
    }
}

/**
 * Get historical readings with pagination and filtering
 */
export function getHistoricalReadings(options: {
    deviceId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}): { readings: AirReading[]; total: number } {
    try {
        const { deviceId, startDate, endDate, limit = 100, offset = 0 } = options;

        let query = 'SELECT * FROM air_readings WHERE 1=1';
        const params: any[] = [];

        if (deviceId) {
            query += ' AND device_id = ?';
            params.push(deviceId);
        }

        if (startDate) {
            query += ' AND timestamp >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND timestamp <= ?';
            params.push(endDate);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
        const countStmt = db.prepare(countQuery);
        const countResult = countStmt.get(...params) as { count: number };
        const total = countResult.count;

        // Get paginated results
        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = db.prepare(query);
        const readings = stmt.all(...params) as AirReading[];

        return { readings, total };
    } catch (error) {
        logger.error('Error getting historical readings:', error);
        return { readings: [], total: 0 };
    }
}

/**
 * Get statistics for a device
 */
export function getDeviceStatistics(deviceId: string, hours: number = 24) {
    try {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as count,
        AVG(aqi) as avg_aqi,
        MIN(aqi) as min_aqi,
        MAX(aqi) as max_aqi,
        AVG(temperature) as avg_temperature,
        AVG(humidity) as avg_humidity,
        AVG(air_quality_ppm) as avg_air_quality_ppm
      FROM air_readings
      WHERE device_id = ? AND timestamp >= ?
    `);

        return stmt.get(deviceId, since);
    } catch (error) {
        logger.error('Error getting device statistics:', error);
        return null;
    }
}
