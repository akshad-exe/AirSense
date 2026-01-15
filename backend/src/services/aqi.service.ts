import { PM25_BREAKPOINTS, PM10_BREAKPOINTS, AQI_CATEGORIES } from '../config/constants';
import { AQIBreakpoint, AQICategory } from '../types/airData';

/**
 * Calculate AQI for a given pollutant concentration
 * Uses the US EPA AQI calculation formula
 */
function calculateAQI(concentration: number, breakpoints: AQIBreakpoint[]): number {
    // Find the appropriate breakpoint
    const bp = breakpoints.find(
        b => concentration >= b.cLow && concentration <= b.cHigh
    );

    // If concentration is out of range, return max AQI
    if (!bp) {
        return 500;
    }

    const { cLow, cHigh, iLow, iHigh } = bp;

    // Apply the AQI formula
    const aqi = ((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow;

    return Math.round(aqi);
}

/**
 * Calculate AQI from PM2.5 and PM10 values
 * Returns the higher of the two AQI values
 */
export function getAQI(pm25: number, pm10: number): number {
    const aqi25 = calculateAQI(pm25, PM25_BREAKPOINTS);
    const aqi10 = calculateAQI(pm10, PM10_BREAKPOINTS);

    // Return the higher AQI (more restrictive)
    return Math.max(aqi25, aqi10);
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
 * Validate PM values are within acceptable ranges
 */
export function validatePMValues(pm25: number, pm10: number): boolean {
    return (
        pm25 >= 0 && pm25 <= 1000 &&
        pm10 >= 0 && pm10 <= 1000 &&
        !isNaN(pm25) && !isNaN(pm10)
    );
}

/**
 * Get complete AQI information
 */
export function getAQIInfo(pm25: number, pm10: number) {
    if (!validatePMValues(pm25, pm10)) {
        throw new Error('Invalid PM values');
    }

    const aqi = getAQI(pm25, pm10);
    const category = getAQICategory(aqi);

    return {
        aqi,
        level: category.level,
        suggestion: category.suggestion,
        color: category.color
    };
}
