import db from '../config/database';

const device = db.prepare('SELECT * FROM devices WHERE device_id = ?').get('esp32-001');

if (device) {
    console.log('\n📱 Device Information:');
    console.log('   Device ID:', device.device_id);
    console.log('   Location:', device.location);
    console.log('   API Key:', device.api_key);
    console.log('   Status:', device.status);
    console.log('\n✅ Use this API key in your ESP32 code!\n');
} else {
    console.log('❌ Device not found. Run: bun run db:seed');
}
