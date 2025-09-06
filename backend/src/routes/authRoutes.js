import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', AuthController.sendOTP);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post("/forgot-password", AuthController.resetPassword);

export default router;
