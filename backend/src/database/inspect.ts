import dotenv from 'dotenv';
import db from '../config/database';
import logger from '../utils/logger';

dotenv.config();

/**
 * Database Inspector
 * View database contents from the command line
 */

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║          AirSense Database Inspector                      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

try {
    // Get all devices
    const devices = db.prepare('SELECT * FROM devices').all();
    console.log('📱 DEVICES:');
    console.log('─'.repeat(60));
    if (devices.length === 0) {
        console.log('  No devices found. Run "bun run db:seed" to add test data.\n');
    } else {
        devices.forEach((device: any) => {
            console.log(`  Device ID: ${device.device_id}`);
            console.log(`  Location:  ${device.location || 'N/A'}`);
            console.log(`  Status:    ${device.status}`);
            console.log(`  API Key:   ${device.api_key}`);
            console.log(`  Last Seen: ${device.last_seen || 'Never'}`);
            console.log('  ' + '─'.repeat(58));
        });
        console.log(`  Total: ${devices.length} device(s)\n`);
    }

    // Get reading count per device
    const readingCounts = db.prepare(`
    SELECT device_id, COUNT(*) as count 
    FROM air_readings 
    GROUP BY device_id
  `).all();

    console.log('📊 AIR READINGS:');
    console.log('─'.repeat(60));
    if (readingCounts.length === 0) {
        console.log('  No readings found.\n');
    } else {
        readingCounts.forEach((row: any) => {
            console.log(`  ${row.device_id}: ${row.count} reading(s)`);
        });

        // Get total count
        const total = db.prepare('SELECT COUNT(*) as count FROM air_readings').get() as { count: number };
        console.log('  ' + '─'.repeat(58));
        console.log(`  Total: ${total.count} reading(s)\n`);
    }

    // Get latest readings
    const latestReadings = db.prepare(`
    SELECT ar.*, d.location 
    FROM air_readings ar
    JOIN devices d ON ar.device_id = d.device_id
    ORDER BY ar.timestamp DESC
    LIMIT 5
  `).all();

    if (latestReadings.length > 0) {
        console.log('🕐 LATEST READINGS (Last 5):');
        console.log('─'.repeat(60));
        latestReadings.forEach((reading: any) => {
            console.log(`  Device:   ${reading.device_id} (${reading.location || 'N/A'})`);
            console.log(`  AQI:      ${reading.aqi} (${reading.air_quality_level})`);
            console.log(`  PM2.5:    ${reading.pm25} µg/m³`);
            console.log(`  PM10:     ${reading.pm10} µg/m³`);
            console.log(`  Time:     ${reading.timestamp}`);
            console.log('  ' + '─'.repeat(58));
        });
    }

    // Database file info
    console.log('\n💾 DATABASE INFO:');
    console.log('─'.repeat(60));
    console.log(`  Location: ${process.env.DB_PATH || './data/airsense.db'}`);
    console.log(`  Tables:   devices, air_readings`);
    console.log('─'.repeat(60));

    console.log('\n✅ Database inspection complete!\n');

} catch (error) {
    logger.error('Error inspecting database:', error);
    console.error('❌ Error:', error);
}

process.exit(0);
