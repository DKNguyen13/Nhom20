import multer from 'multer';
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { login, register, logout,  resetPassword, sendOTP, refreshToken, 
     updateProfileController, changePasswordController, checkRole, 
     getAllUsersController, changeActivateUserController } 
from '../controllers/auth.controller.js';

const router = express.Router();
const upload = multer();

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.patch('/change-password', authenticate, changePasswordController);
router.patch('/update-profile', authenticate, upload.single('avatar'), updateProfileController);
router.patch('/change-activate-user', authenticate, changeActivateUserController);

router.get('/check-role', checkRole);
router.get('/users', authenticate, getAllUsersController);

export default router;
