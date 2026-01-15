// AQI Breakpoints for PM2.5 (US EPA Standard)
export const PM25_BREAKPOINTS = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },      // Good
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },   // Moderate
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },  // Unhealthy for Sensitive
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 }, // Unhealthy
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },// Very Unhealthy
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 } // Hazardous
];

// AQI Breakpoints for PM10 (US EPA Standard)
export const PM10_BREAKPOINTS = [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
    { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
    { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
    { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
    { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
    { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 }
];

// AQI Categories with health suggestions
export const AQI_CATEGORIES = [
    {
        range: [0, 50] as const,
        level: 'Good',
        suggestion: 'Air quality is satisfactory; enjoy outdoor activities',
        color: '#00e400'
    },
    {
        range: [51, 100] as const,
        level: 'Moderate',
        suggestion: 'Sensitive individuals should limit prolonged outdoor exertion',
        color: '#ffff00'
    },
    {
        range: [101, 200] as const,
        level: 'Poor',
        suggestion: 'Reduce prolonged outdoor exposure; consider protective masks',
        color: '#ff7e00'
    },
    {
        range: [201, 300] as const,
        level: 'Very Poor',
        suggestion: 'Avoid outdoor activities; sensitive groups stay indoors',
        color: '#ff0000'
    },
    {
        range: [301, 500] as const,
        level: 'Severe',
        suggestion: 'Health emergency conditions; everyone should remain indoors',
        color: '#8f3f97'
    }
];

// Device status constants
export const DEVICE_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline'
} as const;

// Default values
export const DEFAULTS = {
    PORT: 3000,
    HOST: 'localhost',
    DB_PATH: './data/airsense.db',
    LOG_LEVEL: 'info',
    LOG_DIR: './logs',
    API_KEY_LENGTH: 32,
    DEVICE_OFFLINE_THRESHOLD: 60000, // 60 seconds
    HEARTBEAT_CHECK_INTERVAL: 30000, // 30 seconds
    RATE_LIMIT_WINDOW: 60000, // 1 minute
    RATE_LIMIT_MAX_REQUESTS: 60,
    API_RATE_LIMIT_WINDOW: 900000, // 15 minutes
    API_RATE_LIMIT_MAX: 100
};
