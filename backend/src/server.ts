import dotenv from 'dotenv';
import http from 'http';
import { createApp } from './app';
import { initializeDatabase } from './config/database';
import { initializeWebSocket } from './services/websocket.service';
import { checkOfflineDevices } from './services/device.service';
import { DEFAULTS } from './config/constants';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Configuration
const PORT = parseInt(process.env.PORT || String(DEFAULTS.PORT));
const HOST = process.env.HOST || DEFAULTS.HOST;
const DEVICE_OFFLINE_THRESHOLD = parseInt(
    process.env.DEVICE_OFFLINE_THRESHOLD || String(DEFAULTS.DEVICE_OFFLINE_THRESHOLD)
);
const HEARTBEAT_CHECK_INTERVAL = parseInt(
    process.env.HEARTBEAT_CHECK_INTERVAL || String(DEFAULTS.HEARTBEAT_CHECK_INTERVAL)
);

/**
 * Start the server
 */
async function startServer() {
    try {
        // Initialize database
        logger.info('Initializing database...');
        initializeDatabase();

        // Create Express app
        const app = createApp();

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize WebSocket
        logger.info('Initializing WebSocket server...');
        initializeWebSocket(server);

        // Start device heartbeat monitoring
        logger.info('Starting device heartbeat monitoring...');
        setInterval(() => {
            checkOfflineDevices(DEVICE_OFFLINE_THRESHOLD);
        }, HEARTBEAT_CHECK_INTERVAL);

        // Start server
        server.listen(PORT, HOST, () => {
            logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🌍 AirSense Backend Server                   ║
║                                                            ║
║  Server running at: http://${HOST}:${PORT}${' '.repeat(Math.max(0, 22 - HOST.length - String(PORT).length))}║
║  Environment: ${process.env.NODE_ENV || 'development'}${' '.repeat(Math.max(0, 42 - (process.env.NODE_ENV || 'development').length))}║
║  WebSocket: Enabled                                        ║
║  Database: SQLite (Bun)                                    ║
║                                                            ║
║  API Endpoints:                                            ║
║    POST   /api/air-data                                    ║
║    GET    /api/latest                                      ║
║    GET    /api/history                                     ║
║    GET    /api/devices                                     ║
║    GET    /api/devices/:deviceId                           ║
║    POST   /api/devices/register                            ║
║    GET    /health                                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
        });

        // Graceful shutdown
        const shutdown = () => {
            logger.info('Shutting down server...');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
