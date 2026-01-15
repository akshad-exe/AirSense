# Backend Architecture Overview

## 🏗️ Complete Backend Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     ESP32 IoT Devices                       │
│              (PM2.5 & PM10 Sensors)                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP POST /api/air-data
                     │ (with API key)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Server                          │
│                  (Port 3000)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Middleware  │  │  Middleware  │  │  Middleware  │    │
│  │     Auth     │→ │  Validation  │→ │ Rate Limit   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────┐     │
│  │            Controllers                            │     │
│  │  - airDataController.ts                          │     │
│  │  - deviceController.ts                           │     │
│  │  - historyController.ts                          │     │
│  └────────────────┬─────────────────────────────────┘     │
│                   │                                         │
│                   ▼                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │            Services                               │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │     │
│  │  │ AQI Service│  │Data Service│  │Device Svc  │ │     │
│  │  │ (Calculate)│  │  (CRUD)    │  │(Management)│ │     │
│  │  └────────────┘  └────────────┘  └────────────┘ │     │
│  └────────────────┬─────────────────────────────────┘     │
│                   │                                         │
│                   ▼                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │            Models (ORM-like)                      │     │
│  │  - AirReadingModel.ts                            │     │
│  │  - DeviceModel.ts                                │     │
│  └────────────────┬─────────────────────────────────┘     │
│                   │                                         │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              SQLite Database (Bun)                          │
│              data/airsense.db                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────────────┐     │
│  │  devices         │    │  air_readings            │     │
│  ├──────────────────┤    ├──────────────────────────┤     │
│  │ device_id (PK)   │    │ id (PK)                  │     │
│  │ api_key (UNIQUE) │◄───┤ device_id (FK)           │     │
│  │ location         │    │ pm25                     │     │
│  │ status           │    │ pm10                     │     │
│  │ last_seen        │    │ aqi                      │     │
│  │ created_at       │    │ air_quality_level        │     │
│  │ updated_at       │    │ timestamp                │     │
│  └──────────────────┘    └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ Real-time updates
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              WebSocket Server                               │
│              (ws://localhost:3000)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Broadcasts to all connected clients
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend Clients                               │
│              (React Dashboard)                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Example

### 1. Device Sends Data
```
ESP32 → POST /api/air-data
{
  "device_id": "esp32-001",
  "pm25": 35.2,
  "pm10": 68.5,
  "api_key": "abc123..."
}
```

### 2. Backend Processing
```
Auth Middleware
  ↓ (validates API key)
Validation Middleware
  ↓ (checks PM values)
Controller
  ↓ (receives request)
AQI Service
  ↓ (calculates AQI = 85, level = "Moderate")
Data Service
  ↓ (stores in database)
DeviceModel.create()
  ↓ (SQL INSERT)
SQLite Database
  ↓ (data saved)
WebSocket Service
  ↓ (broadcasts update)
All Connected Clients
```

### 3. Database Storage
```sql
-- Inserted into air_readings table:
INSERT INTO air_readings (device_id, pm25, pm10, aqi, air_quality_level)
VALUES ('esp32-001', 35.2, 68.5, 85, 'Moderate');

-- Updated in devices table:
UPDATE devices 
SET last_seen = '2026-01-15T08:00:00Z', status = 'online'
WHERE device_id = 'esp32-001';
```

### 4. WebSocket Broadcast
```json
{
  "type": "aqi_update",
  "data": {
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "aqi": 85,
    "air_quality_level": "Moderate",
    "timestamp": "2026-01-15T08:00:00.000Z"
  },
  "timestamp": "2026-01-15T08:00:00.000Z"
}
```

## 🗂️ File Organization

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── constants.ts     # AQI breakpoints, defaults
│   │   └── database.ts      # SQLite setup & initialization
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── airData.ts       # Air quality types
│   │   ├── device.ts        # Device types
│   │   ├── api.ts           # API request/response types
│   │   └── bun-sqlite.d.ts  # SQLite type declarations
│   │
│   ├── models/              # Database models (ORM-like)
│   │   ├── AirReading.ts    # Air reading CRUD operations
│   │   ├── Device.ts        # Device CRUD operations
│   │   └── index.ts         # Export all models
│   │
│   ├── services/            # Business logic
│   │   ├── aqiService.ts    # AQI calculation (EPA standard)
│   │   ├── dataService.ts   # Data operations
│   │   ├── deviceService.ts # Device management
│   │   └── websocketService.ts # Real-time broadcasting
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # API key authentication
│   │   ├── validation.ts    # Request validation (Joi)
│   │   ├── errorHandler.ts  # Global error handling
│   │   └── rateLimit.ts     # Rate limiting
│   │
│   ├── controllers/         # Route handlers
│   │   ├── airDataController.ts  # Air data endpoints
│   │   ├── deviceController.ts   # Device endpoints
│   │   └── historyController.ts  # History endpoints
│   │
│   ├── routes/              # API routes
│   │   ├── airData.ts       # /api/air-data, /api/latest
│   │   ├── devices.ts       # /api/devices/*
│   │   ├── history.ts       # /api/history
│   │   └── index.ts         # Route aggregation
│   │
│   ├── utils/               # Utilities
│   │   └── logger.ts        # Winston logger
│   │
│   ├── database/            # Database scripts
│   │   ├── seed.ts          # Seed test data
│   │   └── inspect.ts       # View database contents
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── data/                    # SQLite database files
│   ├── airsense.db          # Main database
│   ├── airsense.db-shm      # Shared memory (auto-generated)
│   └── airsense.db-wal      # Write-ahead log (auto-generated)
│
├── logs/                    # Application logs
│   ├── combined.log         # All logs
│   └── error.log            # Error logs only
│
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── nodemon.json             # Nodemon config
├── README.md                # Main documentation
└── DATABASE_GUIDE.md        # Database documentation
```

## 🔄 Request Lifecycle

### POST /api/air-data
```
1. Client sends request
   ↓
2. Express receives request
   ↓
3. Rate Limiter (60 req/min)
   ↓
4. Validation Middleware (Joi schema)
   ↓
5. Auth Middleware (check API key)
   ↓
6. airDataController.postAirData()
   ↓
7. aqiService.getAQI() - Calculate AQI
   ↓
8. dataService.storeReading()
   ↓
9. AirReadingModel.create() - SQL INSERT
   ↓
10. deviceService.updateLastSeen()
    ↓
11. DeviceModel.updateLastSeen() - SQL UPDATE
    ↓
12. websocketService.broadcastAQIUpdate()
    ↓
13. Send response to client
```

## 🎯 Key Components Explained

### Models vs Services

**Models** (src/models/)
- Direct database operations
- CRUD methods
- SQL queries
- Like an ORM (Object-Relational Mapping)

**Services** (src/services/)
- Business logic
- Orchestrate multiple models
- AQI calculations
- Complex operations

### Why This Architecture?

1. **Separation of Concerns** - Each layer has a specific job
2. **Testability** - Easy to unit test each component
3. **Maintainability** - Changes are isolated
4. **Scalability** - Easy to add features
5. **Type Safety** - TypeScript throughout

## 🔐 Security Layers

```
Request
  ↓
1. Rate Limiter (prevent abuse)
  ↓
2. Helmet (security headers)
  ↓
3. CORS (allowed origins)
  ↓
4. Validation (data integrity)
  ↓
5. Authentication (API key)
  ↓
6. Authorization (device ownership)
  ↓
Controller
```

## 📈 Performance Optimizations

1. **Database Indexes** - Fast lookups
2. **WAL Mode** - Better concurrency
3. **Prepared Statements** - SQL injection prevention + speed
4. **Connection Pooling** - Efficient resource use
5. **Rate Limiting** - Prevent overload
6. **Async/Await** - Non-blocking operations

---

**This architecture ensures:**
- ✅ Fast response times (<100ms)
- ✅ Real-time updates (<3s)
- ✅ Offline capability
- ✅ Secure authentication
- ✅ Scalable design
