export interface AirReading {
    id?: number;
    device_id: string;
    temperature: number;        // DHT22 sensor
    humidity: number;           // DHT22 sensor
    air_quality_ppm: number;    // MQ135 sensor
    aqi: number;
    air_quality_level: string;
    timestamp?: string;
}

export interface AirReadingInput {
    device_id: string;
    temperature: number;
    humidity: number;
    air_quality_ppm: number;
    api_key: string;
}

export interface AirReadingWithDevice extends AirReading {
    location?: string;
    device_status?: string;
}

export interface AQICategory {
    range: readonly [number, number];
    level: string;
    suggestion: string;
    color: string;
}

export interface AQIBreakpoint {
    cLow: number;
    cHigh: number;
    iLow: number;
    iHigh: number;
}
