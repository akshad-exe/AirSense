import { Router } from 'express';
import airDataRoutes from './airdata.route';
import historyRoutes from './history.route';
import deviceRoutes from './device.route';
import distanceRoutes from './distance.route';
import db from '../config/database';
import { getConnectedClientsCount } from '../services/websocket.service';

const router = Router();

// Mount routes
router.use('/api', airDataRoutes);
router.use('/api', historyRoutes);
router.use('/api', deviceRoutes);
router.use('/api', distanceRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
    let dbStatus = 'connected';
    let dbError = null;

    try {
        // Test database connection
        db.prepare('SELECT 1').get();
    } catch (error: any) {
        dbStatus = 'disconnected';
        dbError = error.message;
    }

    const uptime = process.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`;

    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: uptimeFormatted,
        database: {
            status: dbStatus,
            type: 'SQLite',
            ...(dbError && { error: dbError })
        },
        websocket: {
            status: 'active',
            connectedClients: getConnectedClientsCount()
        },
        environment: process.env.NODE_ENV || 'development'
    });
});

// API endpoints documentation (development only) - Auto-discovered!
if (process.env.NODE_ENV !== 'production') {
    router.get('/api/endpoints', (req, res) => {
        const routes: any[] = [];

        // Function to extract routes from Express router
        function extractRoutes(stack: any[], basePath = '') {
            stack.forEach((layer: any) => {
                if (layer.route) {
                    // This is a route
                    const methods = Object.keys(layer.route.methods)
                        .filter(method => layer.route.methods[method])
                        .map(m => m.toUpperCase());

                    routes.push({
                        method: methods.join(', '),
                        path: basePath + layer.route.path,
                        middleware: layer.route.stack.map((s: any) => s.name).filter((n: string) => n !== '<anonymous>')
                    });
                } else if (layer.name === 'router' && layer.handle.stack) {
                    // This is a nested router
                    const path = layer.regexp.source
                        .replace('\\/?', '')
                        .replace('(?=\\/|$)', '')
                        .replace(/\\\//g, '/')
                        .replace('^', '')
                        .replace('$', '');

                    extractRoutes(layer.handle.stack, basePath + path);
                }
            });
        }

        // Extract routes from the main router
        extractRoutes(router.stack);

        // Also get routes from the app if available
        if (req.app && req.app._router) {
            extractRoutes(req.app._router.stack);
        }

        // Remove duplicates and sort
        const uniqueRoutes = Array.from(
            new Map(routes.map(r => [`${r.method}:${r.path}`, r])).values()
        ).sort((a, b) => a.path.localeCompare(b.path));

        res.json({
            success: true,
            message: 'AirSense API Endpoints (Auto-discovered)',
            baseUrl: `http://localhost:${process.env.PORT || 8000}`,
            totalEndpoints: uniqueRoutes.length,
            endpoints: uniqueRoutes,
            websocket: {
                url: `ws://localhost:${process.env.PORT || 8000}`,
                description: 'WebSocket connection for real-time updates',
                messageTypes: ['aqi_update', 'device_status', 'error']
            },
            note: 'This endpoint is only available in development mode'
        });
    });
}

export default router;
