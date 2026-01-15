import { Router } from 'express';
import airDataRoutes from './airdata.route';
import historyRoutes from './history.route';
import deviceRoutes from './device.route';

const router = Router();

// Mount routes
router.use('/api', airDataRoutes);
router.use('/api', historyRoutes);
router.use('/api', deviceRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'AirSense Backend is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
