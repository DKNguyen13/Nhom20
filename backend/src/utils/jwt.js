import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (payload) => {
    return jwt.sign(payload, config.accessTokenKey, { expiresIn: config.accessTokenLife });
};

export const verifyToken = (token) => {
    return jwt.verify(token, config.accessTokenKey);
};
