# AirSense Backend - Quick Start

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Initialize Database
```bash
npm run db:migrate
npm run db:seed  # Optional: Add test data
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start on: http://localhost:3000

---

## 📋 Implementation Checklist

### Phase 1: Core Setup ✅
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env` file
- [ ] Set up TypeScript configuration
- [ ] Create folder structure
- [ ] Set up logger (Winston)
- [ ] Create Express app (`src/app.ts`)
- [ ] Create server entry point (`src/server.ts`)

### Phase 2: Database & Models
- [ ] Create database schema (`src/database/schema.sql`)
- [ ] Implement database connection (`src/config/database.ts`)
- [ ] Create AirReading model (`src/models/AirReading.ts`)
- [ ] Create Device model (`src/models/Device.ts`)
- [ ] Add database migrations
- [ ] Create seed data for testing

### Phase 3: AQI Calculation Service
- [ ] Implement AQI calculation (`src/services/aqiService.ts`)
  - [ ] PM2.5 AQI calculation
  - [ ] PM10 AQI calculation
  - [ ] Category determination
  - [ ] Health suggestion mapping
- [ ] Write unit tests for AQI calculations
- [ ] Validate against EPA standards

### Phase 4: REST API Endpoints
- [ ] **POST /api/air-data**
  - [ ] Create controller (`src/controllers/airDataController.ts`)
  - [ ] Add validation middleware
  - [ ] Implement API key authentication
  - [ ] Calculate AQI
  - [ ] Store in database
  - [ ] Broadcast via WebSocket
  - [ ] Update device last_seen

- [ ] **GET /api/latest**
  - [ ] Create controller
  - [ ] Add optional device_id filter
  - [ ] Return latest reading with device info

- [ ] **GET /api/history**
  - [ ] Create controller (`src/controllers/historyController.ts`)
  - [ ] Add query parameters (device_id, dates, pagination)
  - [ ] Implement pagination
  - [ ] Add date range filtering

- [ ] **GET /api/devices**
  - [ ] Create controller (`src/controllers/deviceController.ts`)
  - [ ] Return all devices with status
  - [ ] Include latest reading for each

- [ ] **GET /api/devices/:deviceId**
  - [ ] Get specific device details
  - [ ] Include latest reading

- [ ] **POST /api/devices/register** (Optional)
  - [ ] Device registration endpoint
  - [ ] Generate API key
  - [ ] Store device info

### Phase 5: WebSocket Implementation
- [ ] Set up WebSocket server (`src/config/websocket.ts`)
- [ ] Create WebSocket service (`src/services/websocketService.ts`)
- [ ] Implement broadcast function
- [ ] Handle client connections
- [ ] Send latest data on connect
- [ ] Implement message types:
  - [ ] `aqi_update`
  - [ ] `device_status`
  - [ ] `error`

### Phase 6: Middleware
- [ ] **Authentication** (`src/middleware/auth.ts`)
  - [ ] API key validation
  - [ ] Device lookup
  - [ ] Attach device to request

- [ ] **Validation** (`src/middleware/validation.ts`)
  - [ ] Request body validation (Joi)
  - [ ] Query parameter validation
  - [ ] Data sanitization

- [ ] **Error Handler** (`src/middleware/errorHandler.ts`)
  - [ ] Global error handler
  - [ ] Error logging
  - [ ] Consistent error responses

- [ ] **Rate Limiting** (`src/middleware/rateLimit.ts`)
  - [ ] Sensor data rate limit (60/min)
  - [ ] API rate limit (100/15min)

### Phase 7: Device Management
- [ ] Device service (`src/services/deviceService.ts`)
  - [ ] Find by API key
  - [ ] Update last_seen
  - [ ] Update status (online/offline)
  - [ ] Get all devices

- [ ] Heartbeat monitoring
  - [ ] Background job to check device status
  - [ ] Update offline devices
  - [ ] Broadcast status changes

### Phase 8: Utilities & Helpers
- [ ] Logger setup (`src/utils/logger.ts`)
- [ ] Validators (`src/utils/validators.ts`)
- [ ] Helper functions (`src/utils/helpers.ts`)
- [ ] Constants (`src/config/constants.ts`)

### Phase 9: Testing
- [ ] **Unit Tests**
  - [ ] AQI calculation tests
  - [ ] Validation tests
  - [ ] Helper function tests

- [ ] **Integration Tests**
  - [ ] POST /api/air-data endpoint
  - [ ] GET /api/latest endpoint
  - [ ] GET /api/history endpoint
  - [ ] GET /api/devices endpoints
  - [ ] WebSocket connections

- [ ] **Test Coverage**
  - [ ] Aim for >80% coverage
  - [ ] Run `npm run test:coverage`

### Phase 10: Documentation & Deployment
- [ ] API documentation (Swagger/OpenAPI)
- [ ] README with setup instructions
- [ ] Environment variable documentation
- [ ] Deployment guide
- [ ] Docker configuration (optional)

---

## 🧪 Testing

### Run Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Test Endpoints with cURL

```bash
# Register a device (if implemented)
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{"device_id": "esp32-001", "location": "Building A"}'

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

---

## 📁 File Creation Order

### 1. Configuration & Setup
```bash
src/config/constants.ts
src/config/database.ts
src/utils/logger.ts
.env
```

### 2. Database
```bash
src/database/schema.sql
src/database/migrate.ts
src/database/seed.ts
```

### 3. Types
```bash
src/types/airData.ts
src/types/device.ts
src/types/api.ts
```

### 4. Models
```bash
src/models/AirReading.ts
src/models/Device.ts
src/models/index.ts
```

### 5. Services
```bash
src/services/aqiService.ts
src/services/dataService.ts
src/services/deviceService.ts
```

### 6. Middleware
```bash
src/middleware/auth.ts
src/middleware/validation.ts
src/middleware/errorHandler.ts
src/middleware/rateLimit.ts
```

### 7. Controllers
```bash
src/controllers/airDataController.ts
src/controllers/historyController.ts
src/controllers/deviceController.ts
```

### 8. Routes
```bash
src/routes/airData.ts
src/routes/devices.ts
src/routes/history.ts
src/routes/index.ts
```

### 9. WebSocket
```bash
src/config/websocket.ts
src/services/websocketService.ts
```

### 10. App & Server
```bash
src/app.ts
src/server.ts
```

---

## 🎯 Priority Tasks

### High Priority (Core Functionality)
1. ✅ Database setup
2. ✅ AQI calculation service
3. ✅ POST /api/air-data endpoint
4. ✅ GET /api/latest endpoint
5. ✅ WebSocket broadcasting

### Medium Priority (Essential Features)
6. ✅ GET /api/history endpoint
7. ✅ GET /api/devices endpoints
8. ✅ API key authentication
9. ✅ Device heartbeat monitoring
10. ✅ Error handling

### Low Priority (Nice to Have)
11. ⏳ Rate limiting
12. ⏳ Comprehensive testing
13. ⏳ API documentation
14. ⏳ Docker setup
15. ⏳ Logging optimization

---

## 📚 Resources

- **SQLite Documentation**: https://www.sqlite.org/docs.html
- **Express.js Guide**: https://expressjs.com/
- **WebSocket (ws) Docs**: https://github.com/websockets/ws
- **EPA AQI Calculator**: https://www.airnow.gov/aqi/aqi-calculator/
- **Better SQLite3**: https://github.com/WiseLibs/better-sqlite3

---

**Status**: Ready to Start Implementation
**Next Step**: Install dependencies and create folder structure
