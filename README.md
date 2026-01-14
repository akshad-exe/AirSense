# AirSense 🌬️

**AirSense** is a comprehensive, offline-first, real-time Air Quality Index (AQI) monitoring platform. It provides users with live data, historical trends, and personalized health recommendations through a premium, theme-aware dashboard.

## 🚀 Key Features

-   **Real-time Monitoring**: Live tracking of AQI, PM2.5, and PM10 levels.
-   **Premium Dashboard**: Modern, responsive UI with glassmorphism and smooth animations.
-   **Historical Analysis**: Interactive charts and data tables for analyzing trends.
-   **Multi-device Management**: Register and monitor multiple sensors across different locations.
-   **Health Recommendations**: Context-aware suggestions based on current air quality conditions.
-   **Dark/Light Mode**: Full theme support with a premium aesthetic.
-   **Offline-First**: Planned support for offline data access and PWA features.

## 🛠️ Technology Stack

### Frontend
-   **Core**: React 19, TypeScript, Vite
-   **Styling**: Tailwind CSS 4, shadcn/ui
-   **Charts**: Recharts
-   **State/Routing**: React Router 7
-   **Theme**: next-themes

### Backend
-   **Core**: Node.js, Express, TypeScript
-   **Database**: SQLite (via better-sqlite3)
-   **Real-time**: WebSockets (ws)
-   **AQI Logic**: EPA Standard calculation service

## 📂 Project Structure

```text
AirSense/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express backend API
├── PROGRESS.md        # Detailed implementation status
└── ARCHITECTURE.md    # System architecture and design plan
```

## 🏁 Quick Start

### 1. Prerequisite
- Node.js (v18+)
- Bun (recommended for frontend) or NPM

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
bun install  # or npm install
bun dev      # or npm run dev
```

## 📝 Progress
See [PROGRESS.md](./PROGRESS.md) for a detailed breakdown of completed features and next steps.

## 📄 License
MIT License - 2026 AirSense Team
