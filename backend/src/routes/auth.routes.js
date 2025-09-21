import express from 'express';
import { login, register, resetPassword, sendOTP, refreshToken, logout} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.post("/forgot-password", resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
