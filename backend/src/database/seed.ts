import dotenv from 'dotenv';
import { initializeDatabase } from '../config/database';
import { registerDevice } from '../services/device.service';
import logger from '../utils/logger';


dotenv.config();

/**
 * Seed the database with a single registered device
 */
async function seedDatabase() {
    try {
        logger.info('Starting database seeding...');

        // Initialize database
        initializeDatabase();

        // Register a single device
        const deviceInput = {
            device_id: 'esp32-001',
            location: 'Living Room'
        };

        logger.info('Registering device...');
        const registeredDevice = registerDevice(deviceInput);

        logger.info('✅ Database seeded successfully!');
        logger.info('\n📱 Device Registered:');
        logger.info(`   Device ID: ${registeredDevice.device_id}`);
        logger.info(`   Location:  ${registeredDevice.location}`);
        logger.info(`   API Key:   ${registeredDevice.api_key}`);
        logger.info('\n💡 Use this API key in your ESP32 code to send sensor data.');

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
