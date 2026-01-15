import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import logger from './utils/logger';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
    app.use(cors({
        origin: corsOrigins,
        credentials: true
    }));

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Custom HTTP request logging (cleaner format)
    if (process.env.NODE_ENV !== 'test') {
        app.use((req, res, next) => {
            const start = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - start;
                const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';

                logger.info(
                    `${statusColor} ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`
                );
            });

            next();
        });
    }

    // Mount routes
    app.use(routes);

    // Error handlers (must be last)
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

export default createApp;
