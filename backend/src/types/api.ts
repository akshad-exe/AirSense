import { Request } from 'express';
import { Device } from './device';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface AuthenticatedRequest extends Request {
    device?: Device;
}

export interface PaginationParams {
    limit?: number;
    offset?: number;
    page?: number;
}

export interface HistoryQuery extends PaginationParams {
    device_id?: string;
    start_date?: string;
    end_date?: string;
}

export interface WebSocketMessage {
    type: 'aqi_update' | 'device_status' | 'error';
    data: any;
    timestamp: string;
}
