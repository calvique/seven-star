import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import { connectDB } from './config/database';
import { handleError, asyncHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { Setting } from './models';

const uploadRoot = path.resolve(config.upload.path);

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.frontendUrls.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(apiLimiter);

app.use('/uploads', express.static(uploadRoot));

app.get('/api/health', asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
}));

app.get('/api/public/settings', asyncHandler(async (req: Request, res: Response) => {
  const settings = await Setting.find({ isPublic: true }).sort({ group: 1, order: 1 });
  const grouped = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) acc[setting.group] = [];
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, any[]>);
  res.json({ success: true, data: { settings: grouped } });
}));

routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(handleError);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Seven Star English Boarding School - Backend Server        ║
║  Environment: ${config.env.padEnd(49)}║
║  Port: ${config.port.toString().padEnd(53)}║
║  API URL: ${config.apiUrl.padEnd(50)}║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;