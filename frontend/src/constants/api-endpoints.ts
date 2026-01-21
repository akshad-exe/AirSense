// API Endpoints based on PRD Backend APIs

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

export const API_ENDPOINTS = {
    // Air Data
    AIR_DATA: `${API_BASE_URL}/api/air-data`,
    LATEST: `${API_BASE_URL}/api/latest`,
    HISTORY: `${API_BASE_URL}/api/history`,

    // Devices
    DEVICES: `${API_BASE_URL}/api/devices`,
    DEVICE_BY_ID: (deviceId: string) => `${API_BASE_URL}/api/devices/${deviceId}`,
} as const;

export const WS_ENDPOINTS = {
    REALTIME: WS_BASE_URL,
} as const;
