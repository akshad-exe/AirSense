import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { WebSocketMessage } from '../types/api';
import logger from '../utils/logger';

let wss: WebSocketServer | null = null;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(server: Server): void {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        logger.info('New WebSocket client connected');

        // Send welcome message
        const welcomeMessage: WebSocketMessage = {
            type: 'aqi_update',
            data: { message: 'Connected to AirSense WebSocket' },
            timestamp: new Date().toISOString()
        };

        ws.send(JSON.stringify(welcomeMessage));

        ws.on('close', () => {
            logger.info('WebSocket client disconnected');
        });

        ws.on('error', (error) => {
            logger.error('WebSocket error:', error);
        });
    });

    console.log('✅ WebSocket server initialized');
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(message: WebSocketMessage): void {
    if (!wss) {
        logger.warn('WebSocket server not initialized');
        return;
    }

    const messageStr = JSON.stringify(message);
    let sentCount = 0;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(messageStr);
                sentCount++;
            } catch (error) {
                logger.error('Error sending WebSocket message:', error);
            }
        }
    });

    if (sentCount > 0) {
        logger.debug(`Broadcast message to ${sentCount} clients`);
    }
}

/**
 * Broadcast AQI update
 */
export function broadcastAQIUpdate(data: any): void {
    broadcast({
        type: 'aqi_update',
        data,
        timestamp: new Date().toISOString()
    });
}

/**
 * Broadcast device status update
 */
export function broadcastDeviceStatus(data: any): void {
    broadcast({
        type: 'device_status',
        data,
        timestamp: new Date().toISOString()
    });
}

/**
 * Get connected clients count
 */
export function getConnectedClientsCount(): number {
    if (!wss) return 0;
    return wss.clients.size;
}
