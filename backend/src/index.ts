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
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (config.frontendUrls.length === 0 || config.frontendUrls.includes(origin)) return callback(null, true);
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

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const base = `${req.protocol}://${req.get('host')}`;
  const routes = ['/', '/about', '/about/chairman', '/about/principal', '/about/mission-vision', '/about/history', '/academics', '/facilities', '/gallery', '/activities', '/achievements', '/notices', '/admissions', '/contact', '/downloads', '/suggestions', '/results'];
  const today = new Date().toISOString().slice(0, 10);
  const body = routes.map((url) => `  <url><loc>${base}${url}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
});

app.get('/robots.txt', (req: Request, res: Response) => {
  const base = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /teacher/\nDisallow: /dashboard/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
});

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

// Serve the compiled Vite frontend assets (JS, CSS, images, favicon, etc.)
// before falling back to index.html for React Router routes.
app.use(express.static(frontendDist, {
  index: false,
  maxAge: config.env === 'production' ? '1d' : 0,
}));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  }

  return res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) {
      console.error('Frontend index.html could not be served:', error);
      res.status(500).send('Website frontend is not built.');
    }
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