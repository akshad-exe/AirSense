// API Client for backend communication

import type {
    ApiResponse,
    LatestAQIResponse,
    HistoryQueryParams,
    HistoryResponse,
    DevicesResponse,
    PostAirDataRequest,
} from '@/types/api';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

class APIClient {
    private async request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                data: null as any,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Get latest AQI reading
    async getLatest(): Promise<ApiResponse<LatestAQIResponse>> {
        return this.request<LatestAQIResponse>(API_ENDPOINTS.LATEST);
    }

    // Get historical data
    async getHistory(params?: HistoryQueryParams): Promise<ApiResponse<HistoryResponse>> {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return this.request<HistoryResponse>(API_ENDPOINTS.HISTORY + queryString);
    }

    // Get all devices
    async getDevices(): Promise<ApiResponse<DevicesResponse>> {
        return this.request<DevicesResponse>(API_ENDPOINTS.DEVICES);
    }

    // Post air data (for testing)
    async postAirData(data: PostAirDataRequest): Promise<ApiResponse<any>> {
        return this.request(API_ENDPOINTS.AIR_DATA, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new APIClient();
