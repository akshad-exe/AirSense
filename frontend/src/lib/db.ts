import { openDB } from 'idb';

export interface AirQualityData {
    id?: number;
    timestamp: string;
    aqi: number;
    pm25: number;
    pm10: number;
    city?: string;
}

interface AirSenseDB {
    metrics: {
        key: string;
        value: AirQualityData;
        indexes: { 'by-timestamp': string };
    };
    settings: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'airsense-db';
const DB_VERSION = 1;

export async function initDB() {
    const db = await openDB<AirSenseDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('metrics')) {
                const store = db.createObjectStore('metrics', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('by-timestamp', 'timestamp');
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings');
            }
        },
    });
    return db;
}

export async function saveMetrics(data: AirQualityData) {
    const db = await initDB();
    return db.add('metrics', data);
}

export async function getLatestMetrics(limit = 24) {
    const db = await initDB();
    const tx = db.transaction('metrics', 'readonly');
    const index = tx.store.index('by-timestamp');
    let cursor = await index.openCursor(null, 'prev');

    const results: AirQualityData[] = [];
    while (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor = await cursor.continue();
    }
    return results;
}

export async function saveSetting(key: string, value: any) {
    const db = await initDB();
    return db.put('settings', value, key);
}

export async function getSetting(key: string) {
    const db = await initDB();
    return db.get('settings', key);
}
