// Device Types based on PRD requirements

export interface Device {
    deviceId: string;
    apiKey: string;
    location: string;
    status: 'online' | 'offline';
    lastSeen: string;
    name?: string;
}

export interface DeviceStatus {
    deviceId: string;
    status: 'online' | 'offline';
    lastSeen: string;
    currentAQI?: number;
    location?: string;
}

export interface DeviceListResponse {
    devices: Device[];
    total: number;
}
