# AirSense Backend

> Offline-First Real-Time AQI Monitoring Platform - Backend Server

## 📋 Overview

AirSense Backend is a Node.js + Express + SQLite server that receives sensor data from ESP32 IoT devices, calculates Air Quality Index (AQI) values, stores data locally, and broadcasts real-time updates via WebSockets.

### Key Features
- ✅ **Offline-First**: Works without internet connectivity
- ✅ **Real-Time**: WebSocket broadcasting (<3 seconds latency)
- ✅ **Local Storage**: SQLite database for fast, reliable data persistence
- ✅ **Multi-Device**: Supports multiple ESP32 sensor nodes
- ✅ **AQI Calculation**: Accurate AQI computation (0-500 range)
- ✅ **Device Management**: Track device status and heartbeats
- ✅ **API Authentication**: Secure API key-based authentication

---

## 🏗️ Architecture

```
ESP32 Devices → REST API → AQI Calculation → SQLite Database
                    ↓
              WebSocket Server → Frontend Dashboard
```

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Real-time**: WebSocket (ws)
- **Language**: TypeScript
- **Validation**: Joi
- **Logging**: Winston

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AirSense/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:migrate

# (Optional) Add test data
npm run db:seed

# Start development server
npm run dev
```

Server will start on: **http://localhost:3000**

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Data models
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── database/        # Database schema & migrations
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── data/                # SQLite database
├── logs/                # Application logs
├── tests/               # Test files
├── .env.example         # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### 1. POST /api/air-data
Receive sensor data from ESP32 devices

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

---

### 2. GET /api/latest
Get latest AQI reading

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
    "device_id": "esp32-001"
  }
}
```

---

### 3. GET /api/history
Get historical AQI data

**Query Parameters**:
- `device_id` (optional)
- `start_date` (optional) - ISO 8601 format
- `end_date` (optional) - ISO 8601 format
- `limit` (optional, default: 100)
- `offset` (optional, default: 0)

**Response**:
```json
{
  "success": true,
  "data": {
    "readings": [...],
    "total": 1500,
    "page": 1,
    "limit": 100
  }
}
```

---

### 4. GET /api/devices
Get all registered devices

**Response**:
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "device_id": "esp32-001",
        "location": "Building A",
        "status": "online",
        "last_seen": "2026-01-14T02:20:00Z"
      }
    ],
    "total": 3
  }
}
```

---

## 🔄 WebSocket

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000');
```

### Message Types

#### AQI Update
```json
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
```

#### Device Status
```json
{
  "type": "device_status",
  "data": {
    "device_id": "esp32-001",
    "status": "online",
    "last_seen": "2026-01-14T02:20:00Z"
  },
  "timestamp": "2026-01-14T02:20:00Z"
}
```

---

## 🗄️ Database Schema

### air_readings
```sql
CREATE TABLE air_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    pm25 REAL NOT NULL,
    pm10 REAL NOT NULL,
    aqi INTEGER NOT NULL,
    air_quality_level TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### devices
```sql
CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    api_key TEXT NOT NULL UNIQUE,
    location TEXT,
    status TEXT DEFAULT 'offline',
    last_seen DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧮 AQI Calculation

AQI is calculated using the US EPA standard based on PM2.5 and PM10 concentrations.

### Categories

| AQI Range | Category   | Health Suggestion |
|-----------|------------|-------------------|
| 0-50      | Good       | Air quality is satisfactory |
| 51-100    | Moderate   | Sensitive individuals should limit outdoor exertion |
| 101-200   | Poor       | Reduce prolonged outdoor exposure |
| 201-300   | Very Poor  | Avoid outdoor activities |
| 301-500   | Severe     | Health emergency conditions |

---

## 🔐 Security

### API Key Authentication
All sensor data submissions require a valid API key:

```bash
curl -X POST http://localhost:3000/api/air-data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "api_key": "your-device-api-key"
  }'
```

### Rate Limiting
- **Sensor Data**: 60 requests/minute per device
- **API Endpoints**: 100 requests/15 minutes

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📝 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run tests
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

---

## 🌍 Environment Variables

See `.env.example` for all available configuration options.

### Key Variables
```env
NODE_ENV=development
PORT=3000
DB_PATH=./data/airsense.db
CORS_ORIGIN=http://localhost:5173
DEVICE_OFFLINE_THRESHOLD=60000
```

---

## 📊 Device Management

### Device Registration
Devices must be registered before sending data:

```bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "esp32-001",
    "location": "Building A"
  }'
```

Response includes generated API key for the device.

### Heartbeat Monitoring
- Devices are marked **online** when data is received
- Devices are marked **offline** after 60 seconds of inactivity
- Status updates are broadcast via WebSocket

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```bash
docker build -t airsense-backend .
docker run -p 3000:3000 airsense-backend
```

---

## 📚 Documentation

- **[BACKEND_PLAN.md](./BACKEND_PLAN.md)** - Complete implementation plan
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Step-by-step checklist
- **[API Documentation](./docs/API.md)** - Detailed API reference (coming soon)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

For issues and questions:
- Check the [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- Review the [BACKEND_PLAN.md](./BACKEND_PLAN.md)
- Open an issue on GitHub

---

**Status**: Ready for Implementation
**Version**: 1.0.0
**Created**: January 14, 2026
