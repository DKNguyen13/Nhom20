import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Access Token
export const generateAccessToken = (payload) =>
  jwt.sign(payload, config.accessTokenKey, { expiresIn: config.accessTokenLife });

// Refresh Token
export const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.refreshTokenKey, { expiresIn: config.refreshTokenLife });

// Verify Access Token
export const verifyAccessToken = (token) =>
  jwt.verify(token, config.accessTokenKey);

// Verify Refresh Token
export const verifyRefreshToken = (token) =>
  jwt.verify(token, config.refreshTokenKey);
