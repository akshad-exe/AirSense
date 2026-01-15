# Quick Reference Guide

## 🗄️ Database Files Explained

### In `backend/data/` folder:

```
📁 data/
  ├── 📄 airsense.db          ← Main database (40 KB)
  ├── 📄 airsense.db-shm      ← Shared memory (32 KB)
  └── 📄 airsense.db-wal      ← Write-ahead log
```

### What Each File Does:

#### `airsense.db` - **Main Database**
- **Type**: SQLite binary database file
- **Contains**: All your data (devices + air readings)
- **Size**: ~40 KB (grows as you add data)
- **Can I open it?**: Not in text editor! Use tools below ⬇️

#### `airsense.db-shm` - **Shared Memory**
- **Purpose**: Helps multiple processes access database
- **Auto-managed**: SQLite creates/deletes automatically
- **Don't touch**: Let SQLite handle it

#### `airsense.db-wal` - **Write-Ahead Log**
- **Purpose**: Temporary storage for pending writes
- **Why**: Better performance + crash recovery
- **Auto-managed**: SQLite handles it

### 🔍 How to View the Database

#### Option 1: Command Line (Easiest!)
```bash
bun run db:inspect
```
**Output:**
```
╔════════════════════════════════════════════════════════════╗
║          AirSense Database Inspector                      ║
╚════════════════════════════════════════════════════════════╝

📱 DEVICES:
──────────────────────────────────────────────────────────
  Device ID: esp32-001
  Location:  Campus Building A
  Status:    online
  API Key:   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Last Seen: 2026-01-15T08:00:00.000Z
  ──────────────────────────────────────────────────────────
  Total: 3 device(s)

📊 AIR READINGS:
──────────────────────────────────────────────────────────
  esp32-001: 2 reading(s)
  esp32-002: 2 reading(s)
  esp32-003: 2 reading(s)
  ──────────────────────────────────────────────────────────
  Total: 6 reading(s)

🕐 LATEST READINGS (Last 5):
──────────────────────────────────────────────────────────
  Device:   esp32-001 (Campus Building A)
  AQI:      85 (Moderate)
  PM2.5:    35.2 µg/m³
  PM10:     68.5 µg/m³
  Time:     2026-01-15T08:00:00.000Z
  ──────────────────────────────────────────────────────────
```

#### Option 2: VS Code Extension
1. Press `Ctrl+Shift+X` (Extensions)
2. Search: **"SQLite Viewer"**
3. Install it
4. Right-click `airsense.db` → **"Open Database"**

#### Option 3: DB Browser (Free App)
1. Download: https://sqlitebrowser.org/
2. Install and open
3. Click **"Open Database"**
4. Select `airsense.db`

## 📊 Database Schema (Visual)

```
┌─────────────────────────────────────────────────────────────┐
│                      DEVICES TABLE                          │
├─────────────────────────────────────────────────────────────┤
│ device_id (PK)     │ "esp32-001"                            │
│ api_key (UNIQUE)   │ "a1b2c3d4e5f6..."                      │
│ location           │ "Campus Building A"                     │
│ status             │ "online" or "offline"                   │
│ last_seen          │ "2026-01-15T08:00:00.000Z"             │
│ created_at         │ "2026-01-15T02:00:00.000Z"             │
│ updated_at         │ "2026-01-15T08:00:00.000Z"             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ One device has many readings
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AIR_READINGS TABLE                        │
├─────────────────────────────────────────────────────────────┤
│ id (PK)            │ 1                                       │
│ device_id (FK)     │ "esp32-001"                            │
│ pm25               │ 35.2                                    │
│ pm10               │ 68.5                                    │
│ aqi                │ 85                                      │
│ air_quality_level  │ "Moderate"                             │
│ timestamp          │ "2026-01-15T08:00:00.000Z"             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Models vs Services vs Controllers

### 🗂️ Models (Database Layer)
**Location**: `src/models/`

**What they do**: Talk directly to the database

```typescript
// Example: AirReadingModel
AirReadingModel.create({ ... })      // INSERT INTO air_readings
AirReadingModel.findById(1)          // SELECT * FROM air_readings WHERE id = 1
AirReadingModel.findAll({ ... })     // SELECT * FROM air_readings WHERE ...
```

**Think of it as**: Smart database tables

### ⚙️ Services (Business Logic)
**Location**: `src/services/`

**What they do**: Complex operations, calculations

```typescript
// Example: aqiService
aqiService.getAQI(pm25, pm10)        // Calculate AQI from PM values
aqiService.getAQICategory(85)        // Get category (Good, Moderate, etc.)

// Example: deviceService
deviceService.registerDevice({ ... }) // Register new device
deviceService.updateLastSeen(id)      // Update device status
```

**Think of it as**: The brain that makes decisions

### 🎮 Controllers (Request Handlers)
**Location**: `src/controllers/`

**What they do**: Handle HTTP requests

```typescript
// Example: airDataController
postAirData(req, res)                // POST /api/air-data
getLatest(req, res)                  // GET /api/latest
```

**Think of it as**: The receptionist that handles requests

## 🔄 Complete Flow Example

### When ESP32 sends data:

```
1. ESP32 Device
   │
   │ HTTP POST /api/air-data
   │ { device_id, pm25, pm10, api_key }
   ▼
2. Express Server (Port 3000)
   │
   │ Rate Limiter: ✅ (under 60/min)
   │ Validator: ✅ (data is valid)
   │ Auth: ✅ (API key is correct)
   ▼
3. airDataController.postAirData()
   │
   │ Receives request
   ▼
4. aqiService.getAQI(pm25, pm10)
   │
   │ Calculates: AQI = 85, Level = "Moderate"
   ▼
5. dataService.storeReading()
   │
   │ Calls AirReadingModel.create()
   ▼
6. AirReadingModel.create()
   │
   │ SQL: INSERT INTO air_readings (...)
   ▼
7. SQLite Database (airsense.db)
   │
   │ Data saved! ✅
   ▼
8. deviceService.updateLastSeen()
   │
   │ SQL: UPDATE devices SET last_seen = NOW()
   ▼
9. websocketService.broadcast()
   │
   │ Sends to all connected clients
   ▼
10. Frontend Dashboard
    │
    │ Updates in real-time! 🎉
```

## 📝 Common Commands

```bash
# Start development server
bun run dev

# View database contents
bun run db:inspect

# Add test data
bun run db:seed

# Start production server
bun run start

# Build TypeScript
bun run build
```

## 🧪 Test the API

### 1. Check if server is running
```bash
curl http://localhost:3000/health
```

### 2. Get all devices
```bash
curl http://localhost:3000/api/devices
```

### 3. Get latest reading
```bash
curl http://localhost:3000/api/latest
```

### 4. Send sensor data (need API key from db:inspect)
```bash
curl -X POST http://localhost:3000/api/air-data \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "esp32-001",
    "pm25": 35.2,
    "pm10": 68.5,
    "api_key": "YOUR_API_KEY_HERE"
  }'
```

## 🎓 Understanding SQLite

### Why can't I open .db in text editor?

SQLite databases are **binary files**, not text files. They're optimized for:
- Fast queries
- Compact storage
- Data integrity
- Concurrent access

**It's like trying to open a .jpg in Notepad** - you need the right tool!

### What's inside the .db file?

```
┌─────────────────────────────────────┐
│      airsense.db (Binary File)      │
├─────────────────────────────────────┤
│ • Table schemas                     │
│ • Indexes                           │
│ • All device records                │
│ • All air quality readings          │
│ • Metadata                          │
└─────────────────────────────────────┘
```

### How SQLite stores data:

```
Text file (CSV):           SQLite (Binary):
─────────────────          ─────────────────
device_id,location         [Optimized binary format]
esp32-001,Building A       [Indexed for fast lookup]
esp32-002,Building B       [Compressed efficiently]
                           [Supports transactions]
                           [ACID compliant]

Size: ~2 KB                Size: ~40 KB (includes indexes)
Speed: Slow                Speed: Very fast ⚡
Queries: Manual parsing    Queries: SQL engine
```

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS (reverse proxy)
- [ ] Regular database backups (`cp airsense.db backup.db`)
- [ ] Monitor logs in `logs/` folder
- [ ] Set up process manager (PM2)

## 📚 Documentation Files

1. **README.md** - Complete API documentation
2. **DATABASE_GUIDE.md** - Database deep dive
3. **ARCHITECTURE.md** - System architecture
4. **IMPLEMENTATION_SUMMARY.md** - What we built
5. **QUICK_REFERENCE.md** - This file!

---

**Need help? Run `bun run db:inspect` to see your data!** 🎯
