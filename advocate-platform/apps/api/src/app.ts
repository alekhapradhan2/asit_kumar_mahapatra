import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { env } from './config/env';
import { prisma } from './config/database';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// ─── Route Modules ────────────────────────────────────────────────────────────
import { authRouter } from './modules/auth/auth.routes';
import { clientsRouter } from './modules/clients/clients.routes';
import { casesRouter } from './modules/cases/cases.routes';
import { articlesRouter } from './modules/articles/articles.routes';
import { successStoriesRouter } from './modules/success-stories/successStories.routes';
import { integrationsRouter } from './modules/integrations/integrations.routes';
import { publicRouter } from './modules/public/public.routes';
import { documentsRouter } from './modules/documents/documents.routes';
import { messagesRouter } from './modules/messages/messages.routes';

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Trust proxy (needed for rate limiting with IP behind load balancer)
app.set('trust proxy', 1);

// ─── Rate Limiting (general) ──────────────────────────────────────────────────
app.use('/api/v1', apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      services: { database: 'connected' },
    });
  } catch {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: { database: 'disconnected' },
    });
  }
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/cases', casesRouter);
app.use('/api/v1/articles', articlesRouter);
app.use('/api/v1/success-stories', successStoriesRouter);
app.use('/api/v1/integrations', integrationsRouter);
app.use('/api/v1/public', publicRouter);
app.use('/api/v1/documents', documentsRouter);
app.use('/api/v1/messages', messagesRouter);

// ─── 404 + Error Handlers ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(env.PORT, () => {
      console.log(`🚀 API server running on http://localhost:${env.PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export { app };
