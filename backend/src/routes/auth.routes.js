import multer from 'multer';
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();
const upload = multer();

router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/send-otp', authController.sendOTP);
router.post('/register', authController.register);
router.post('/forgot-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.patch('/change-password', authenticate, authController.changePassword);
router.patch('/update-profile', authenticate, upload.single('avatar'), authController.updateProfileController);

router.get('/check-role', authController.checkRole);

export default router;
