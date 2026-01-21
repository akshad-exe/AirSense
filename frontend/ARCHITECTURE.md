# AirSense Frontend Architecture Plan

## 📋 Based on PRD Requirements

### Core Features from PRD:
1. **Live AQI Display** - Real-time AQI value (0-500)
2. **PM2.5 and PM10 Values** - Particulate matter concentrations
3. **AQI Category Indicator** - Color-coded status
4. **Real-time Charts** - Historical data visualization
5. **Device Online/Offline Status** - Multi-device monitoring
6. **Historical AQI Visualization** - Time-series data
7. **PWA Support** - Offline-first with IndexedDB
8. **WebSocket Integration** - Real-time updates (<3 seconds)

---

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   └── icons/                     # PWA icons
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── tabs.tsx           # NEW
│   │   │   ├── table.tsx          # NEW
│   │   │   ├── chart.tsx          # NEW
│   │   │   ├── select.tsx         # NEW
│   │   │   ├── switch.tsx         # NEW
│   │   │   ├── toast.tsx          # NEW
│   │   │   ├── dialog.tsx         # NEW
│   │   │   ├── dropdown-menu.tsx  # NEW
│   │   │   ├── alert.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   └── input.tsx
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── AQIDisplay.tsx     # Large AQI number display
│   │   │   ├── PMCards.tsx        # PM2.5 & PM10 cards
│   │   │   ├── HealthSuggestions.tsx
│   │   │   ├── DeviceStatus.tsx   # Device monitoring
│   │   │   ├── AQIChart.tsx       # Real-time chart
│   │   │   └── AQIScale.tsx       # Reference scale
│   │   ├── history/               # Historical data components
│   │   │   ├── HistoryChart.tsx   # Time-series visualization
│   │   │   ├── DataTable.tsx      # Tabular data view
│   │   │   └── DateRangePicker.tsx
│   │   ├── devices/               # Device management
│   │   │   ├── DeviceList.tsx
│   │   │   ├── DeviceCard.tsx
│   │   │   └── DeviceSelector.tsx
│   │   ├── settings/              # Settings components
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── DataExport.tsx
│   │   └── layout/                # Layout components
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Footer.tsx
│   │       └── MainLayout.tsx
│   ├── pages/                     # Page components
│   │   ├── Dashboard.tsx          # Main dashboard (/)
│   │   ├── History.tsx            # Historical data (/history)
│   │   ├── Devices.tsx            # Device management (/devices)
│   │   ├── Settings.tsx           # Settings (/settings)
│   │   └── NotFound.tsx           # 404 page
│   ├── lib/
│   │   ├── utils.ts               # Utility functions
│   │   ├── aqi-utils.ts           # AQI calculations
│   │   ├── api.ts                 # API client
│   │   ├── websocket.ts           # WebSocket client
│   │   └── db.ts                  # IndexedDB wrapper
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAQIData.ts          # AQI data hook
│   │   ├── useWebSocket.ts        # WebSocket hook
│   │   ├── useOfflineStorage.ts   # IndexedDB hook
│   │   ├── useDevices.ts          # Device management hook
│   │   └── useTheme.ts            # Theme hook
│   ├── context/                   # React Context
│   │   ├── AQIContext.tsx         # Global AQI state
│   │   ├── DeviceContext.tsx      # Device state
│   │   └── ThemeContext.tsx       # Theme state
│   ├── types/                     # TypeScript types
│   │   ├── aqi.ts                 # AQI-related types
│   │   ├── device.ts              # Device types
│   │   └── api.ts                 # API response types
│   ├── constants/                 # Constants
│   │   ├── aqi-categories.ts      # AQI category definitions
│   │   └── api-endpoints.ts       # API endpoints
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── components.json                # shadcn/ui config
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 📄 Pages & Routes

### 1. Dashboard Page (`/`)
**Purpose**: Main real-time monitoring view
**Components**:
- Large AQI Display
- PM2.5 & PM10 Cards
- Health Suggestions
- Device Status Indicators
- Mini Real-time Chart
- AQI Scale Reference

### 2. History Page (`/history`)
**Purpose**: Historical data analysis
**Components**:
- Date Range Picker
- Time-series Charts (Line, Bar)
- Data Table with pagination
- Export functionality (CSV, JSON)
- Filters (by device, date, AQI range)

### 3. Devices Page (`/devices`)
**Purpose**: Multi-device monitoring and management
**Components**:
- Device List/Grid
- Device Status Cards
- Device Selector
- Last Seen timestamps
- Location information

### 4. Settings Page (`/settings`)
**Purpose**: User preferences and configuration
**Components**:
- Theme Toggle (Light/Dark)
- Notification Settings
- Data Refresh Interval
- AQI Threshold Alerts
- Data Export/Import

---

## 🎨 shadcn/ui Components to Install

### Priority 1 - Essential (Install Now)
```bash
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add chart
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Priority 2 - Enhanced Features
```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add accordion
npx shadcn@latest add sheet
```

### Priority 3 - Advanced Features
```bash
npx shadcn@latest add navigation-menu
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add slider
```

---

## 🔌 API Integration Plan

### REST API Endpoints (from PRD)
```typescript
// lib/api.ts
const API_BASE = 'http://localhost:3000/api';

export const api = {
  // Get latest AQI reading
  getLatest: () => fetch(`${API_BASE}/latest`),
  
  // Get historical data
  getHistory: (params) => fetch(`${API_BASE}/history?${params}`),
  
  // Get device status
  getDevices: () => fetch(`${API_BASE}/devices`),
  
  // Post sensor data (for testing)
  postAirData: (data) => fetch(`${API_BASE}/air-data`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
};
```

### WebSocket Integration
```typescript
// lib/websocket.ts
const WS_URL = 'ws://localhost:3000';

export class AQIWebSocket {
  private ws: WebSocket;
  
  connect(onMessage: (data: AQIData) => void) {
    this.ws = new WebSocket(WS_URL);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  }
  
  disconnect() {
    this.ws?.close();
  }
}
```

---

## 💾 Offline-First Strategy (IndexedDB)

### Database Schema
```typescript
// lib/db.ts
const DB_NAME = 'airsense-db';
const STORES = {
  aqiReadings: 'aqi_readings',
  devices: 'devices',
  settings: 'settings'
};

// Store structure:
// aqi_readings: { id, deviceId, aqi, pm25, pm10, timestamp }
// devices: { deviceId, name, location, status, lastSeen }
// settings: { key, value }
```

### Sync Strategy
1. **Online**: WebSocket → Update UI + Save to IndexedDB
2. **Offline**: Load from IndexedDB → Display last known data
3. **Reconnect**: Sync IndexedDB with backend

---

## 🎯 Component Breakdown

### Dashboard Components

#### 1. AQIDisplay.tsx
- Large numerical display (0-500)
- Dynamic gradient background
- Category badge
- Last updated timestamp
- Pulse animation for live updates

#### 2. PMCards.tsx
- Two cards: PM2.5 and PM10
- Numerical values with units
- Progress bars
- Color-coded indicators
- Hover effects

#### 3. HealthSuggestions.tsx
- Context-aware recommendations
- Three sections: General, Sensitive, Indoor
- Icon indicators
- Expandable details

#### 4. DeviceStatus.tsx
- Multi-device support
- Online/offline badges
- Device selector dropdown
- Last seen timestamps
- Location tags

#### 5. AQIChart.tsx
- Real-time line chart (last 1 hour)
- Recharts library
- Color-coded zones
- Responsive design
- Time axis

#### 6. AQIScale.tsx
- Color-coded reference
- All 5 categories
- Interactive tooltips
- Compact design

---

## 🚀 Implementation Phases

### Phase 1: Core Dashboard (Current)
- ✅ Basic AQI display
- ✅ PM cards
- ✅ Health suggestions
- ✅ Device status
- ✅ AQI scale

### Phase 2: Navigation & Routing
- [ ] Install React Router
- [ ] Create page components
- [ ] Add navigation menu
- [ ] Implement routing

### Phase 3: Historical Data
- [ ] Install chart components
- [ ] Create history page
- [ ] Add date range picker
- [ ] Implement data table

### Phase 4: Real-time Integration
- [ ] WebSocket client
- [ ] API client
- [ ] Custom hooks
- [ ] Context providers

### Phase 5: Offline Support
- [ ] IndexedDB setup
- [ ] Service worker
- [ ] PWA manifest
- [ ] Offline detection

### Phase 6: Advanced Features
- [ ] Multi-device support
- [ ] Settings page
- [ ] Data export
- [ ] Notifications
- [ ] Dark mode

---

## 📦 Additional Dependencies Needed

```json
{
  "dependencies": {
    "react-router-dom": "^6.x",      // Routing
    "recharts": "^2.x",              // Charts
    "date-fns": "^3.x",              // Date utilities
    "idb": "^8.x",                   // IndexedDB wrapper
    "zustand": "^4.x",               // State management (optional)
    "@tanstack/react-query": "^5.x"  // Data fetching (optional)
  },
  "devDependencies": {
    "vite-plugin-pwa": "^0.x"        // PWA support
  }
}
```

---

## 🎨 Design System

### Color Palette (AQI-based)
- Good: `#10b981` (Green)
- Moderate: `#f59e0b` (Yellow)
- Poor: `#f97316` (Orange)
- Very Poor: `#ef4444` (Red)
- Severe: `#991b1b` (Dark Red)

### Typography
- Font: Inter (Google Fonts)
- Headings: 700-900 weight
- Body: 400-500 weight
- Mono: For numerical displays

### Spacing
- Base unit: 4px
- Card padding: 24px
- Section gaps: 24px
- Component gaps: 16px

---

## ✅ Next Steps

1. **Install shadcn components** using CLI
2. **Set up routing** with React Router
3. **Create page components** (Dashboard, History, Devices, Settings)
4. **Implement WebSocket client** for real-time data
5. **Add IndexedDB** for offline support
6. **Create custom hooks** for data management
7. **Build chart components** for historical data
8. **Add PWA support** with service worker
9. **Implement theme toggle** for dark mode
10. **Add data export** functionality

---

**Created**: January 14, 2026
**Status**: Planning Complete - Ready for Implementation
