import dotenv from 'dotenv';
import { initializeDatabase } from '../config/database';
import { registerDevice } from '../services/device.service';
import { storeReading } from '../services/data.service';
import logger from '../utils/logger';

dotenv.config();

/**
 * Seed the database with test data
 */
async function seedDatabase() {
    try {
        logger.info('Starting database seeding...');

        // Initialize database
        initializeDatabase();

        // Register test devices
        const devices = [
            { device_id: 'esp32-001', location: 'Campus Building A' },
            { device_id: 'esp32-002', location: 'Campus Building B' },
            { device_id: 'esp32-003', location: 'Campus Library' }
        ];

        logger.info('Registering test devices...');
        const registeredDevices = devices.map(device => {
            const registered = registerDevice(device);
            logger.info(`Device: ${registered.device_id}, API Key: ${registered.api_key}`);
            return registered;
        });

        // Add some sample readings
        logger.info('Adding sample readings...');
        const sampleReadings = [
            { device_id: 'esp32-001', pm25: 25.5, pm10: 45.2 },
            { device_id: 'esp32-001', pm25: 30.2, pm10: 50.8 },
            { device_id: 'esp32-002', pm25: 15.8, pm10: 35.4 },
            { device_id: 'esp32-002', pm25: 18.3, pm10: 38.9 },
            { device_id: 'esp32-003', pm25: 42.1, pm10: 75.6 },
            { device_id: 'esp32-003', pm25: 38.7, pm10: 68.2 }
        ];

        sampleReadings.forEach(reading => {
            storeReading(reading);
        });

        logger.info('✅ Database seeded successfully!');
        logger.info('\nTest Device Credentials:');
        registeredDevices.forEach(device => {
            logger.info(`  ${device.device_id}: ${device.api_key}`);
        });

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
