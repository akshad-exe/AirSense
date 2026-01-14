// AQI Data Types based on PRD requirements

export interface AQIReading {
    id: number;
    deviceId: string;
    pm25: number;
    pm10: number;
    aqi: number;
    airQualityLevel: string;
    timestamp: string;
}

export interface AQIData {
    aqi: number;
    pm25: number;
    pm10: number;
    category: string;
    healthSuggestion: string;
    timestamp: string;
    deviceStatus: 'online' | 'offline';
    deviceId?: string;
    location?: string;
}

export interface AQICategory {
    range: [number, number];
    label: string;
    color: string;
    gradient: string;
    healthSuggestion: string;
    textColor: string;
    bgColor: string;
}

export interface HistoricalData {
    readings: AQIReading[];
    startDate: string;
    endDate: string;
    deviceId?: string;
}

export interface AQIChartData {
    timestamp: string;
    aqi: number;
    pm25: number;
    pm10: number;
    category: string;
}
