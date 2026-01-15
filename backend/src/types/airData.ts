export interface AirReading {
    id?: number;
    device_id: string;
    pm25: number;
    pm10: number;
    aqi: number;
    air_quality_level: string;
    timestamp?: string;
}

export interface AirReadingInput {
    device_id: string;
    pm25: number;
    pm10: number;
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
