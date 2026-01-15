export interface Device {
    device_id: string;
    api_key: string;
    location?: string;
    status: 'online' | 'offline';
    last_seen?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DeviceInput {
    device_id: string;
    location?: string;
}

export interface DeviceWithLatestReading extends Device {
    latest_reading?: {
        aqi: number;
        pm25: number;
        pm10: number;
        air_quality_level: string;
        timestamp: string;
    };
}
