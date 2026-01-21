import { AQI_CATEGORIES } from '../config/constants';
import { AQICategory } from '../types/airData';

/**
 * MQ135 PPM to AQI Conversion Breakpoints
 * Based on air quality standards for general air pollutants
 * MQ135 detects: CO2, NH3, NOx, Alcohol, Benzene, Smoke
 */
const PPM_BREAKPOINTS = [
    { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },       // Good
    { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },   // Moderate
    { cLow: 101, cHigh: 200, iLow: 101, iHigh: 150 }, // Unhealthy for Sensitive
    { cLow: 201, cHigh: 300, iLow: 151, iHigh: 200 }, // Unhealthy
    { cLow: 301, cHigh: 500, iLow: 201, iHigh: 300 }, // Very Unhealthy
    { cLow: 501, cHigh: 1000, iLow: 301, iHigh: 500 } // Hazardous
];

/**
 * Calculate AQI from MQ135 PPM value
 */
function calculateAQIFromPPM(ppm: number): number {
    // Find the appropriate breakpoint
    const bp = PPM_BREAKPOINTS.find(
        b => ppm >= b.cLow && ppm <= b.cHigh
    );

    // If concentration is out of range, return max AQI
    if (!bp) {
        return ppm > 1000 ? 500 : 0;
    }

    const { cLow, cHigh, iLow, iHigh } = bp;

    // Apply the AQI formula
    const aqi = ((iHigh - iLow) / (cHigh - cLow)) * (ppm - cLow) + iLow;

    return Math.round(aqi);
}

/**
 * Calculate AQI from MQ135 air quality PPM
 */
export function getAQI(airQualityPPM: number): number {
    return calculateAQIFromPPM(airQualityPPM);
}

/**
 * Get AQI category information based on AQI value
 */
export function getAQICategory(aqi: number): AQICategory {
    const category = AQI_CATEGORIES.find(
        cat => aqi >= cat.range[0] && aqi <= cat.range[1]
    );

    // If AQI is out of range, return the most severe category
    return category || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

/**
 * Validate sensor values are within acceptable ranges
 */
export function validateSensorValues(
    temperature: number,
    humidity: number,
    airQualityPPM: number
): boolean {
    return (
        temperature >= -40 && temperature <= 80 &&      // DHT22 range
        humidity >= 0 && humidity <= 100 &&              // DHT22 range
        airQualityPPM >= 0 && airQualityPPM <= 1000 &&  // MQ135 range
        !isNaN(temperature) && !isNaN(humidity) && !isNaN(airQualityPPM)
    );
}

/**
 * Get complete AQI information from sensor data
 */
export function getAQIInfo(
    temperature: number,
    humidity: number,
    airQualityPPM: number
) {
    if (!validateSensorValues(temperature, humidity, airQualityPPM)) {
        throw new Error('Invalid sensor values');
    }

    const aqi = getAQI(airQualityPPM);
    const category = getAQICategory(aqi);

    return {
        aqi,
        level: category.level,
        suggestion: category.suggestion,
        color: category.color,
        temperature,
        humidity,
        airQualityPPM
    };
}
