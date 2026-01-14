# AirSense Backend - Complete Implementation Plan

## 📋 Based on PRD Requirements

### Project Overview
**AirSense Backend** is an offline-first, real-time Node.js server that:
- Receives sensor data from ESP32 IoT devices via REST API
- Stores data in local SQLite database
- Calculates AQI values (0-500 range)
- Broadcasts real-time updates via WebSockets
- Provides historical data access
- Manages multiple IoT devices with authentication

---

## 🏗️ Technology Stack (From PRD Section 7)

### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite (local embedded database)
- **Real-time**: WebSocket (ws library)
- **Validation**: Joi or Zod
- **Security**: API key authentication
- **Logging**: Winston or Pino

### Additional Libraries
- **better-sqlite3** - Fast SQLite driver
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **morgan** - HTTP logging

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # SQLite configuration
│   │   ├── websocket.ts         # WebSocket configuration
│   │   └── constants.ts         # App constants
│   ├── models/
│   │   ├── AirReading.ts        # Air reading model
│   │   ├── Device.ts            # Device model
│   │   └── index.ts             # Model exports
│   ├── controllers/
│   │   ├── airDataController.ts # Air data endpoints
│   │   ├── deviceController.ts  # Device endpoints
│   │   └── historyController.ts # History endpoints
│   ├── services/
│   │   ├── aqiService.ts        # AQI calculation logic
│   │   ├── deviceService.ts     # Device management
│   │   ├── dataService.ts       # Data operations
│   │   └── websocketService.ts  # WebSocket broadcasting
│   ├── middleware/
│   │   ├── auth.ts              # API key authentication
│   │   ├── validation.ts        # Request validation
│   │   ├── errorHandler.ts      # Error handling
│   │   └── rateLimit.ts         # Rate limiting
│   ├── routes/
│   │   ├── airData.ts           # /api/air-data routes
│   │   ├── devices.ts           # /api/devices routes
│   │   ├── history.ts           # /api/history routes
│   │   └── index.ts             # Route aggregation
│   ├── database/
│   │   ├── schema.sql           # Database schema
│   │   ├── migrations/          # Database migrations
│   │   └── seeds/               # Seed data for testing
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── validators.ts        # Data validators
│   │   └── helpers.ts           # Helper functions
│   ├── types/
│   │   ├── airData.ts           # Air data types
│   │   ├── device.ts            # Device types
│   │   └── api.ts               # API types
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
├── data/
│   └── airsense.db              # SQLite database file
├── logs/                        # Application logs
├── .env.example                 # Environment template
├── .env                         # Environment variables
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

---

## 🗄️ Database Design (From PRD Section 8)

### Schema Definition

#### 1. `air_readings` Table
```sql
CREATE TABLE IF NOT EXISTS air_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    pm25 REAL NOT NULL,
    pm10 REAL NOT NULL,
    aqi INTEGER NOT NULL,
    air_quality_level TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- Indexes for performance
CREATE INDEX idx_air_readings_device_id ON air_readings(device_id);
CREATE INDEX idx_air_readings_timestamp ON air_readings(timestamp);
CREATE INDEX idx_air_readings_aqi ON air_readings(aqi);
```

#### 2. `devices` Table
```sql
CREATE TABLE IF NOT EXISTS devices (
    device_id TEXT PRIMARY KEY,
    api_key TEXT NOT NULL UNIQUE,
    location TEXT,
    status TEXT DEFAULT 'offline',
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for API key lookup
CREATE INDEX idx_devices_api_key ON devices(api_key);
```

#### 3. `device_heartbeats` Table (Optional - for monitoring)
```sql
CREATE TABLE IF NOT EXISTS device_heartbeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

CREATE INDEX idx_heartbeats_device_id ON device_heartbeats(device_id);
CREATE INDEX idx_heartbeats_timestamp ON device_heartbeats(timestamp);
```

---

## 🔌 API Endpoints (From PRD Section 7)

### 1. POST /api/air-data
**Purpose**: Receive sensor data from ESP32 devices

**Request**:
```json
{
  "device_id": "esp32-001",
  "pm25": 35.2,
  "pm10": 68.5,
  "api_key": "device-secret-key"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1234,
    "aqi": 85,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-14T02:20:00Z"
  }
}
```

**Logic**:
1. Validate API key
2. Validate PM2.5 and PM10 values
3. Calculate AQI
4. Determine air quality level
5. Store in database
6. Broadcast via WebSocket
7. Update device last_seen

---

### 2. GET /api/latest
**Purpose**: Fetch latest AQI reading

**Query Parameters**:
- `device_id` (optional) - Filter by device

**Response**:
```json
{
  "success": true,
  "data": {
    "aqi": 85,
    "pm25": 35.2,
    "pm10": 68.5,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-14T02:20:00Z",
    "device_id": "esp32-001",
    "location": "Campus Building A"
  }
}
```

---

### 3. GET /api/history
**Purpose**: Fetch historical AQI data

**Query Parameters**:
- `device_id` (optional) - Filter by device
- `start_date` (optional) - Start date (ISO 8601)
- `end_date` (optional) - End date (ISO 8601)
- `limit` (optional, default: 100) - Max records
- `offset` (optional, default: 0) - Pagination offset

**Response**:
```json
{
  "success": true,
  "data": {
    "readings": [
      {
        "id": 1234,
        "device_id": "esp32-001",
        "pm25": 35.2,
        "pm10": 68.5,
        "aqi": 85,
        "air_quality_level": "Moderate",
        "timestamp": "2026-01-14T02:20:00Z"
      }
    ],
    "total": 1500,
    "page": 1,
    "limit": 100
  }
}
```

---

### 4. GET /api/devices
**Purpose**: Fetch all registered devices

**Response**:
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "device_id": "esp32-001",
        "location": "Campus Building A",
        "status": "online",
        "last_seen": "2026-01-14T02:20:00Z"
      }
    ],
    "total": 3
  }
}
```

---

### 5. GET /api/devices/:deviceId
**Purpose**: Get specific device details

**Response**:
```json
{
  "success": true,
  "data": {
    "device_id": "esp32-001",
    "location": "Campus Building A",
    "status": "online",
    "last_seen": "2026-01-14T02:20:00Z",
    "latest_reading": {
      "aqi": 85,
      "pm25": 35.2,
      "pm10": 68.5,
      "timestamp": "2026-01-14T02:20:00Z"
    }
  }
}
```

---

## 🧮 AQI Calculation Logic (From PRD Section 11)

### AQI Formula (US EPA Standard)

```typescript
// AQI Breakpoints for PM2.5 and PM10
const PM25_BREAKPOINTS = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },      // Good
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },   // Moderate
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },  // Unhealthy for Sensitive
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 }, // Unhealthy
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },// Very Unhealthy
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 } // Hazardous
];

const PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 }
];

function calculateAQI(concentration: number, breakpoints: Breakpoint[]): number {
  const bp = breakpoints.find(
    b => concentration >= b.cLow && concentration <= b.cHigh
  );
  
  if (!bp) return 500; // Max AQI if out of range
  
  const { cLow, cHigh, iLow, iHigh } = bp;
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow);
}

function getAQI(pm25: number, pm10: number): number {
  const aqi25 = calculateAQI(pm25, PM25_BREAKPOINTS);
  const aqi10 = calculateAQI(pm10, PM10_BREAKPOINTS);
  return Math.max(aqi25, aqi10); // Return the higher AQI
}
```

### AQI Categories (From PRD Section 11)

```typescript
const AQI_CATEGORIES = [
  {
    range: [0, 50],
    level: 'Good',
    suggestion: 'Air quality is satisfactory; enjoy outdoor activities'
  },
  {
    range: [51, 100],
    level: 'Moderate',
    suggestion: 'Sensitive individuals should limit prolonged outdoor exertion'
  },
  {
    range: [101, 200],
    level: 'Poor',
    suggestion: 'Reduce prolonged outdoor exposure; consider protective masks'
  },
  {
    range: [201, 300],
    level: 'Very Poor',
    suggestion: 'Avoid outdoor activities; sensitive groups stay indoors'
  },
  {
    range: [301, 500],
    level: 'Severe',
    suggestion: 'Health emergency conditions; everyone should remain indoors'
  }
];

function getAQICategory(aqi: number) {
  return AQI_CATEGORIES.find(
    cat => aqi >= cat.range[0] && aqi <= cat.range[1]
  ) || AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}
```

---

## 🔄 WebSocket Implementation

### WebSocket Server Setup

```typescript
import WebSocket from 'ws';

const wss = new WebSocket.Server({ server: httpServer });

// Broadcast to all connected clients
function broadcast(data: any) {
  const message = JSON.stringify({
    type: 'aqi_update',
    data,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  // Send latest data on connect
  sendLatestData(ws);
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
```

### WebSocket Message Types

```typescript
// AQI Update
{
  "type": "aqi_update",
  "data": {
    "aqi": 85,
    "pm25": 35.2,
    "pm10": 68.5,
    "air_quality_level": "Moderate",
    "device_id": "esp32-001",
    "timestamp": "2026-01-14T02:20:00Z"
  },
  "timestamp": "2026-01-14T02:20:00Z"
}

// Device Status Update
{
  "type": "device_status",
  "data": {
    "device_id": "esp32-001",
    "status": "online",
    "last_seen": "2026-01-14T02:20:00Z"
  },
  "timestamp": "2026-01-14T02:20:00Z"
}

// Error
{
  "type": "error",
  "data": {
    "message": "Connection error"
  },
  "timestamp": "2026-01-14T02:20:00Z"
}
```

---

## 🔐 Security & Authentication

### API Key Authentication

```typescript
// Middleware
async function authenticateDevice(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.body.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    });
  }
  
  const device = await deviceService.findByApiKey(apiKey);
  
  if (!device) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  req.device = device;
  next();
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Limit sensor data posts
const sensorDataLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute (1 per second)
  message: 'Too many requests from this device'
});

// Limit API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many API requests'
});
```

---

## 📊 Device Management

### Device Registration

```typescript
// POST /api/devices/register
{
  "device_id": "esp32-001",
  "location": "Campus Building A"
}

// Response
{
  "success": true,
  "data": {
    "device_id": "esp32-001",
    "api_key": "generated-secret-key",
    "location": "Campus Building A"
  }
}
```

### Device Heartbeat Monitoring

```typescript
// Update device status based on last_seen
async function updateDeviceStatuses() {
  const OFFLINE_THRESHOLD = 60 * 1000; // 60 seconds
  const now = Date.now();
  
  const devices = await deviceService.getAllDevices();
  
  for (const device of devices) {
    const lastSeen = new Date(device.last_seen).getTime();
    const isOnline = (now - lastSeen) < OFFLINE_THRESHOLD;
    
    if (device.status !== (isOnline ? 'online' : 'offline')) {
      await deviceService.updateStatus(device.device_id, isOnline ? 'online' : 'offline');
      
      // Broadcast status change
      broadcast({
        type: 'device_status',
        data: {
          device_id: device.device_id,
          status: isOnline ? 'online' : 'offline'
        }
      });
    }
  }
}

// Run every 30 seconds
setInterval(updateDeviceStatuses, 30000);
```

---

## 🧪 Testing Strategy

### Unit Tests
- AQI calculation functions
- Data validation
- Helper utilities

### Integration Tests
- API endpoints
- Database operations
- WebSocket connections

### Test Data
```typescript
const mockSensorData = {
  device_id: 'test-device',
  pm25: 35.2,
  pm10: 68.5,
  api_key: 'test-api-key'
};
```

---

## 📝 Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_PATH=./data/airsense.db

# Security
API_KEY_LENGTH=32
CORS_ORIGIN=http://localhost:5173

# WebSocket
WS_PORT=3000

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Device Management
DEVICE_OFFLINE_THRESHOLD=60000  # 60 seconds
HEARTBEAT_CHECK_INTERVAL=30000  # 30 seconds

# Rate Limiting
RATE_LIMIT_WINDOW=60000         # 1 minute
RATE_LIMIT_MAX_REQUESTS=60      # 60 requests per minute
```

---

## 🚀 Implementation Phases

### Phase 1: Core Setup
- [x] Project structure
- [ ] Express app setup
- [ ] SQLite database initialization
- [ ] Basic error handling
- [ ] Logging setup

### Phase 2: Database & Models
- [ ] Create database schema
- [ ] Implement models
- [ ] Add migrations
- [ ] Seed test data

### Phase 3: AQI Calculation
- [ ] Implement AQI calculation service
- [ ] Add category determination
- [ ] Unit tests for calculations

### Phase 4: REST API
- [ ] POST /api/air-data endpoint
- [ ] GET /api/latest endpoint
- [ ] GET /api/history endpoint
- [ ] GET /api/devices endpoints
- [ ] Request validation
- [ ] API authentication

### Phase 5: WebSocket
- [ ] WebSocket server setup
- [ ] Real-time broadcasting
- [ ] Connection management
- [ ] Message types

### Phase 6: Device Management
- [ ] Device registration
- [ ] API key generation
- [ ] Heartbeat monitoring
- [ ] Status updates

### Phase 7: Security & Performance
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Security headers
- [ ] Query optimization
- [ ] Caching (if needed)

### Phase 8: Testing & Documentation
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation
- [ ] Deployment guide

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.2.2",
    "ws": "^8.16.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.10",
    "@types/better-sqlite3": "^7.6.8",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "supertest": "^6.3.3"
  }
}
```

---

## 🎯 Success Criteria

- ✅ Receives sensor data from ESP32 devices
- ✅ Calculates AQI accurately (0-500 range)
- ✅ Stores data in SQLite with <100ms latency
- ✅ Broadcasts updates via WebSocket (<3 seconds)
- ✅ Handles multiple devices simultaneously
- ✅ Authenticates devices with API keys
- ✅ Provides historical data queries
- ✅ Monitors device online/offline status
- ✅ Works completely offline (no internet required)
- ✅ Handles 60+ requests per minute per device

---

**Status**: Ready for Implementation
**Created**: January 14, 2026
**Based on**: AirSense PRD v1.0
