// API Response Types based on PRD backend endpoints

import type { AQIReading } from './aqi';
import type { Device } from './device';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface LatestAQIResponse {
    aqi: number;
    pm25: number;
    pm10: number;
    airQualityLevel: string;
    timestamp: string;
    deviceId: string;
}

export interface HistoryQueryParams {
    deviceId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}

export interface HistoryResponse {
    readings: AQIReading[];
    total: number;
    page: number;
    limit: number;
}

export interface DevicesResponse {
    devices: Device[];
    total: number;
}

export interface PostAirDataRequest {
    deviceId: string;
    pm25: number;
    pm10: number;
    apiKey: string;
}

export interface WebSocketMessage {
    type: 'aqi_update' | 'device_status' | 'error';
    data: any;
    timestamp: string;
}
