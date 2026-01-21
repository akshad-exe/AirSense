# AirSense Frontend - Air Quality Monitoring Dashboard

A modern, beautiful React dashboard for real-time Air Quality Index (AQI) monitoring built with React, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 🎨 **Modern UI Design** - Clean, academic-style interface with premium aesthetics
- 📊 **Real-time AQI Display** - Large, prominent AQI value (0-500 scale)
- 🏷️ **Category Badge** - Color-coded air quality categories (Good, Moderate, Poor, Very Poor, Severe)
- 💨 **PM2.5 & PM10 Cards** - Detailed particulate matter concentration displays
- 💡 **Health Suggestions** - Context-aware health recommendations based on AQI levels
- 📡 **Device Status** - Online/Offline indicator for monitoring device connectivity
- 🎭 **Smooth Animations** - Micro-animations and transitions for enhanced UX
- 🌈 **Custom Gradients** - Beautiful gradient backgrounds for each AQI category
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful icon library
- **Google Fonts (Inter)** - Modern typography

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build
# or
bun run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── card.tsx
│   │   │   └── badge.tsx
│   │   └── AQIDashboard.tsx # Main dashboard component
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── aqi-utils.ts     # AQI calculation utilities
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## AQI Categories

| AQI Range | Category   | Color       | Health Suggestion                                          |
|-----------|------------|-------------|------------------------------------------------------------|
| 0-50      | Good       | Green       | Air quality is satisfactory; enjoy outdoor activities      |
| 51-100    | Moderate   | Yellow      | Sensitive individuals should limit prolonged outdoor exertion |
| 101-200   | Poor       | Orange      | Reduce prolonged outdoor exposure; consider protective masks |
| 201-300   | Very Poor  | Red         | Avoid outdoor activities; sensitive groups stay indoors    |
| 301-500   | Severe     | Dark Red    | Health emergency conditions; everyone should remain indoors |

## Customization

### Connecting to Backend

To connect to your backend API, update the `App.tsx` file to fetch data from your server:

```typescript
useEffect(() => {
  // Replace with your WebSocket or API endpoint
  const ws = new WebSocket('ws://localhost:3000');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setAqiData(data);
  };

  return () => ws.close();
}, []);
```

### Styling

- Modify `tailwind.config.js` for theme customization
- Update CSS variables in `src/index.css` for color schemes
- Adjust component styles in individual component files

## License

MIT

## Author

Built for the AirSense project - Offline-First Real-Time AQI Monitoring Platform
