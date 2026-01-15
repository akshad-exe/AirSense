# AirSense Backend

**Offline-First Real-Time AQI Monitoring Platform Backend**

A Node.js backend server built with Express.js, Bun runtime, and SQLite that receives sensor data from ESP32 IoT devices, calculates Air Quality Index (AQI), and broadcasts real-time updates via WebSocket.

## 🚀 Features

- ✅ **Real-time AQI Calculation** - US EPA standard PM2.5 and PM10 calculations
- ✅ **WebSocket Broadcasting** - Live updates to all connected clients
- ✅ **SQLite Database** - Lightweight, offline-first data storage using Bun's built-in SQLite
- ✅ **Device Management** - API key authentication and device registration
- ✅ **Historical Data** - Query past readings with pagination
- ✅ **Rate Limiting** - Protection against excessive requests
- ✅ **Heartbeat Monitoring** - Automatic device online/offline status tracking
- ✅ **RESTful API** - Clean, well-documented endpoints

## 📋 Prerequisites

- **Bun** v1.3.5 or higher ([Install Bun](https://bun.sh))
- **Node.js** v18+ (for compatibility)

## 🛠️ Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
bun install

# Create environment file
cp .env.example .env

# Seed database with test data
bun run db:seed
```

## 🎯 Quick Start

```bash
# Development mode (with hot reload)
bun run dev

# Production mode
bun run start
```

The server will start at: **http://localhost:3000**

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Air Data Endpoints

#### Submit Sensor Data
```http
POST /api/air-data
Content-Type: application/json

{
  "device_id": "esp32-001",
  "pm25": 35.2,
  "pm10": 68.5,
  "api_key": "your-device-api-key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "aqi": 85,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-15T02:30:00.000Z"
  }
}
```

#### Get Latest Reading
```http
GET /api/latest?device_id=esp32-001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "aqi": 85,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-15T02:30:00.000Z",
    "location": "Campus Building A",
    "device_status": "online"
  }
}
```

### Historical Data

#### Get History
```http
GET /api/history?device_id=esp32-001&limit=10&offset=0
```

**Query Parameters:**
- `device_id` (optional) - Filter by device
- `start_date` (optional) - ISO 8601 date
- `end_date` (optional) - ISO 8601 date
- `limit` (optional, default: 100) - Max records
- `offset` (optional, default: 0) - Pagination offset

### Device Management

#### List All Devices
```http
GET /api/devices
```

#### Get Specific Device
```http
GET /api/devices/:deviceId
```

#### Register New Device
```http
POST /api/devices/register
Content-Type: application/json

{
  "device_id": "esp32-004",
  "location": "Campus Lab"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device_id": "esp32-004",
    "api_key": "generated-api-key-here",
    "location": "Campus Lab",
    "message": "Device registered successfully. Please save the API key securely."
  }
}
```

## 🔌 WebSocket Connection

Connect to WebSocket at: `ws://localhost:3000`

### Message Types

#### AQI Update
```json
{
  "type": "aqi_update",
  "data": {
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "aqi": 85,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-15T02:30:00.000Z"
  },
  "timestamp": "2026-01-15T02:30:00.000Z"
}
```

#### Device Status Update
```json
{
  "type": "device_status",
  "data": {
    "device_id": "esp32-001",
    "status": "online",
    "last_seen": "2026-01-15T02:30:00.000Z"
  },
  "timestamp": "2026-01-15T02:30:00.000Z"
}
```

## 🗄️ Database Schema

### `devices` Table
```sql
CREATE TABLE devices (
  device_id TEXT PRIMARY KEY,
  api_key TEXT NOT NULL UNIQUE,
  location TEXT,
  status TEXT DEFAULT 'offline',
  last_seen DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `air_readings` Table
```sql
CREATE TABLE air_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  pm25 REAL NOT NULL,
  pm10 REAL NOT NULL,
  aqi INTEGER NOT NULL,
  air_quality_level TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(device_id)
);
```

## 🧮 AQI Calculation

The backend uses the **US EPA AQI calculation standard** for PM2.5 and PM10:

### AQI Categories

| AQI Range | Level | Color | Health Suggestion |
|-----------|-------|-------|-------------------|
| 0-50 | Good | Green | Air quality is satisfactory |
| 51-100 | Moderate | Yellow | Sensitive individuals should limit prolonged outdoor exertion |
| 101-200 | Poor | Orange | Reduce prolonged outdoor exposure |
| 201-300 | Very Poor | Red | Avoid outdoor activities |
| 301-500 | Severe | Purple | Health emergency conditions |

## ⚙️ Configuration

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_PATH=./data/airsense.db

# Security
API_KEY_LENGTH=32
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

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
API_RATE_LIMIT_WINDOW=900000    # 15 minutes
API_RATE_LIMIT_MAX=100          # 100 requests per 15 minutes
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.ts        # AQI breakpoints and constants
│   │   └── database.ts         # SQLite configuration
│   ├── controllers/
│   │   ├── airDataController.ts
│   │   ├── deviceController.ts
│   │   └── historyController.ts
│   ├── middleware/
│   │   ├── auth.ts             # API key authentication
│   │   ├── errorHandler.ts     # Error handling
│   │   ├── rateLimit.ts        # Rate limiting
│   │   └── validation.ts       # Request validation
│   ├── routes/
│   │   ├── airData.ts
│   │   ├── devices.ts
│   │   ├── history.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── aqiService.ts       # AQI calculation logic
│   │   ├── dataService.ts      # Data operations
│   │   ├── deviceService.ts    # Device management
│   │   └── websocketService.ts # WebSocket broadcasting
│   ├── types/
│   │   ├── airData.ts
│   │   ├── api.ts
│   │   ├── device.ts
│   │   └── bun-sqlite.d.ts
│   ├── utils/
│   │   └── logger.ts           # Winston logger
│   ├── database/
│   │   └── seed.ts             # Database seeding
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── data/                       # SQLite database
├── logs/                       # Application logs
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🧪 Testing

### Test with cURL

```bash
# Register a device
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{"device_id": "esp32-test", "location": "Test Lab"}'

# Send sensor data
curl -X POST http://localhost:3000/api/air-data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "api_key": "your-api-key"
  }'

# Get latest reading
curl http://localhost:3000/api/latest

# Get history
curl "http://localhost:3000/api/history?limit=10"

# Get devices
curl http://localhost:3000/api/devices
```

### Test Devices (from seed script)

After running `bun run db:seed`, you'll have these test devices:

1. **esp32-001** - Campus Building A
2. **esp32-002** - Campus Building B
3. **esp32-003** - Campus Library

Check the console output for their API keys.

## 🔒 Security Features

- ✅ **API Key Authentication** - Device-specific API keys
- ✅ **Rate Limiting** - Prevents abuse
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Configurable origins
- ✅ **Input Validation** - Joi schema validation
- ✅ **SQL Injection Protection** - Prepared statements

## 📊 Monitoring

### Device Status

Devices are automatically marked as **offline** if they haven't sent data within the configured threshold (default: 60 seconds). The heartbeat monitor runs every 30 seconds.

### Logs

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🚀 Deployment

### Production Build

```bash
# Build TypeScript
bun run build

# Start production server
NODE_ENV=production bun run start
```

### Docker (Optional)

```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
```

## 🤝 Integration with ESP32

### Arduino/ESP32 Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* serverUrl = "http://your-server:3000/api/air-data";
const char* apiKey = "your-device-api-key";
const char* deviceId = "esp32-001";

void sendAirData(float pm25, float pm10) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"device_id\":\"" + String(deviceId) + 
                   "\",\"pm25\":" + String(pm25) + 
                   ",\"pm10\":" + String(pm10) + 
                   ",\"api_key\":\"" + String(apiKey) + "\"}";
  
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    String response = http.getString();
    Serial.println(response);
  }
  
  http.end();
}
```

## 📝 License

MIT

## 👥 Authors

AirSense Team

---

**Built with ❤️ using Bun, Express.js, and SQLite**
