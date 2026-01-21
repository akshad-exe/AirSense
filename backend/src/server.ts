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
        console.log('🔧 Initializing database...');
        initializeDatabase();

        // Create Express app
        const app = createApp();

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize WebSocket
        console.log('🔧 Initializing WebSocket server...');
        initializeWebSocket(server);

        // Start device heartbeat monitoring
        console.log('🔧 Starting device heartbeat monitoring...');
        setInterval(() => {
            checkOfflineDevices(DEVICE_OFFLINE_THRESHOLD);
        }, HEARTBEAT_CHECK_INTERVAL);

        // Start server
        server.listen(PORT, HOST, () => {
            // Clean console output for startup banner
            console.log('\n' + '='.repeat(60));
            console.log('🌍  AirSense Backend Server');
            console.log('='.repeat(60));
            console.log(`📡  Server:      http://${HOST}:${PORT}`);
            console.log(`🌐  Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💾  Database:    SQLite (Bun)`);
            console.log(`🔌  WebSocket:   Enabled`);
            console.log('='.repeat(60));
            console.log('📋  Quick Links:');
            console.log(`    Health:     http://${HOST}:${PORT}/health`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`    Endpoints:  http://${HOST}:${PORT}/api/endpoints`);
            }
            console.log('='.repeat(60) + '\n');

            logger.info(`Server started on http://${HOST}:${PORT}`);
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
