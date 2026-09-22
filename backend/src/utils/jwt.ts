import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

const signOptions: SignOptions = {
  algorithm: 'HS256',
};

export const generateTokens = (payload: TokenPayload): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    ...signOptions,
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({ id: payload.id }, config.jwt.refreshSecret, {
    ...signOptions,
    expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { id: string };
};

export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};

export const getTokenExpiry = (token: string): Date | null => {
  const decoded = jwt.decode(token) as { exp: number } | null;
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
};

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return expiry < new Date();
};