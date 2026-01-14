export interface AQIData {
    aqi: number;
    pm25: number;
    pm10: number;
    category: string;
    healthSuggestion: string;
    timestamp: string;
    deviceStatus: 'online' | 'offline';
}

export interface AQICategory {
    range: [number, number];
    label: string;
    color: string;
    gradient: string;
    healthSuggestion: string;
}

export const AQI_CATEGORIES: AQICategory[] = [
    {
        range: [0, 50],
        label: 'Good',
        color: 'text-green-600',
        gradient: 'gradient-good',
        healthSuggestion: 'Air quality is satisfactory; enjoy outdoor activities',
    },
    {
        range: [51, 100],
        label: 'Moderate',
        color: 'text-yellow-600',
        gradient: 'gradient-moderate',
        healthSuggestion: 'Sensitive individuals should limit prolonged outdoor exertion',
    },
    {
        range: [101, 200],
        label: 'Poor',
        color: 'text-orange-600',
        gradient: 'gradient-poor',
        healthSuggestion: 'Reduce prolonged outdoor exposure; consider protective masks',
    },
    {
        range: [201, 300],
        label: 'Very Poor',
        color: 'text-red-600',
        gradient: 'gradient-very-poor',
        healthSuggestion: 'Avoid outdoor activities; sensitive groups stay indoors',
    },
    {
        range: [301, 500],
        label: 'Severe',
        color: 'text-red-900',
        gradient: 'gradient-severe',
        healthSuggestion: 'Health emergency conditions; everyone should remain indoors',
    },
];

export function getAQICategory(aqi: number): AQICategory {
    return (
        AQI_CATEGORIES.find(
            (category) => aqi >= category.range[0] && aqi <= category.range[1]
        ) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
    );
}

export function getAQICategoryColor(aqi: number): string {
    return getAQICategory(aqi).gradient;
}

export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
