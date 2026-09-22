import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const frontendUrls = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

const generatedJwtSecret = crypto.randomBytes(48).toString('base64url');
const generatedRefreshSecret = crypto.randomBytes(48).toString('base64url');

export const config = {
  env,
  port: parseInt(process.env.PORT || '5000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  frontendUrl: frontendUrls[0] || '',
  frontendUrls,
  mongodb: { uri: process.env.MONGODB_URI || '' },
  jwt: {
    secret: process.env.JWT_SECRET || generatedJwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || generatedRefreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@example.invalid',
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

if (env === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.warn('WARNING: JWT_SECRET is not configured. A temporary secret was generated for this instance; set JWT_SECRET in Render to keep sessions stable across restarts.');
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    console.warn('WARNING: JWT_REFRESH_SECRET is not configured. A temporary secret was generated for this instance; set JWT_REFRESH_SECRET in Render to keep refresh tokens stable across restarts.');
  }
  if (!process.env.FRONTEND_URL && !process.env.FRONTEND_URLS) {
    console.warn('WARNING: FRONTEND_URL is not configured. CORS will temporarily reflect the requesting origin. Set FRONTEND_URL in Render for a restricted production policy.');
  }
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not configured. The API requires MongoDB to store admissions, users, teachers, students, results and CMS content.');
  }
}
