import { Database } from 'bun:sqlite';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './data/airsense.db';

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create and configure database
export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for better concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
export function initializeDatabase() {
  // Create devices table
  db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      device_id TEXT PRIMARY KEY,
      api_key TEXT NOT NULL UNIQUE,
      location TEXT,
      status TEXT DEFAULT 'offline',
      last_seen DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create index for API key lookup
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_devices_api_key ON devices(api_key);
  `);

  // Create air_readings table for DHT22 + MQ135 sensors
  db.exec(`
    CREATE TABLE IF NOT EXISTS air_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      air_quality_ppm REAL NOT NULL,
      aqi INTEGER NOT NULL,
      air_quality_level TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(device_id)
    );
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_air_readings_device_id ON air_readings(device_id);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_air_readings_timestamp ON air_readings(timestamp);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_air_readings_aqi ON air_readings(aqi);
  `);

  console.log('✅ Database initialized successfully');
}

export default db;
