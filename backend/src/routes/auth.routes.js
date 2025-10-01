import multer from 'multer';
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = express.Router();
const upload = multer();

router.post('/send-otp', AuthController.sendOTP);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

router.patch('/change-password', authenticate, AuthController.changePasswordController);
router.patch('/update-profile', authenticate, upload.single('avatar'), AuthController.updateProfileController);
router.patch('/change-activate-user', authenticate, AuthController.changeActivateUserController);

router.get('/check-role', AuthController.checkRole);
router.get('/users', authenticate, AuthController.getAllUsersController);

export default router;
