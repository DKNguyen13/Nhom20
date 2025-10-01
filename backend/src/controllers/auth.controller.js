import axios from "axios";
import { config } from "../config/env.config.js";
import redisClient from "../config/redis.config.js";
import { success, error } from '../utils/response.js';
import * as AuthService from '../services/auth.service.js';
import { authenticate } from '../middleware/authenticate.js';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';

// Normal Login
export const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken }  = await AuthService.normalLoginService(req.body);

        await redisClient.set(`refreshToken:${user._id}`, refreshToken, { EX: 7*24*60*60 });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.cookieSecure,
            sameSite: config.cookieSameSite,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return success(res, 'Login successfull', { 
            user: { fullname: user.fullname, email : user.email, phone : user.phone, avatarUrl : user.avatarUrl, role : user.role },
            accessToken
        });
    } catch (err) {
        console.log('Normal login error:', err.message);
        return error(res, "Login error. Please try again!", 400);
    }
};

// Google Login
export const googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.googleLoginService({ tokenId });

        await redisClient.set(`refreshToken:${user.id}`, refreshToken, { EX: 7*24*60*60 });

        // Set cookie refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.cookieSecure,
            sameSite: config.cookieSameSite,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        return success(res, 'Google login successful', { 
            user: { fullname: user.fullname, email : user.email, avatarUrl: user.avatarUrl },
            accessToken
        });
    } catch (err) {
        console.error("Google login error:", err);
        return error(res, "Google login error. Please try again!", 400);
    }
};

// Register account
export const register = async (req, res) => {
    try{
        const { fullname, email, password, phone, dob, avatarUrl, otp } = req.body;
        await AuthService.register({ fullname, email, password, phone, dob, avatarUrl, otp });
        return success(res, 'Register successful. Please login.')
    }
    catch (err){
        console.log("Register fail:", err.message);
        return error(res, 'Register fail. Please try again!', 400);
    }
};

// Send register OTP to email
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const message = await AuthService.sendRegisterOTPService(email);
        return success(res, message);
    } catch (err) {
        console.log("Send register OTP fail:", err.message);
        return error(res, "Send OTP fail. Please try again", 400);
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, token } = req.body;

        const captcha = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaSecret}&response=${token}`
        );
        if (!captcha.data.success) throw new Error("CAPTCHA không hợp lệ");

        const message = await AuthService.resetPassword({ email });
        return success(res, message);
    } catch (err) {
        console.log('Reset password error:', err.message);
        return error(res, 'Reset password error', 400);
    }
};

// Logout
export const logout = async (req, res) => {
    try{
        const token = req.cookies.refreshToken;
        if (token) {
        const decoded = verifyRefreshToken(token);
        await redisClient.del(`refreshToken:${decoded.id}`);
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: config.cookieSecure,
            sameSite: config.cookieSameSite,
        });
        return success(res, "Logged out successfully");
    }
    catch(err){
        console.error("Error logging out user: ", err);
        return error(res, "Logout failed", 500);
    }
};

// Refresh Access Token
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return error(res, 'No refresh token provided', 401);

        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id);
        const storedToken = await redisClient.get(`refreshToken:${user._id}`);

        if (!user || !user.isActive) throw new Error('User not found or inactive');
        if (!storedToken || storedToken !== token) return error(res, 'Invalid or revoked refresh token', 401);
        const newAccessToken = generateAccessToken({ id: user._id, role: user.role });

        return success(res, 'New access token', { newAccessToken });
    } catch (err) {
        console.log('Refresh access token invalid', err.message)
        return error(res, 'Refresh access token invalid', 401);
    }
};

// Update profile
export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fullname = req.body.fullname || '';
    const fileBuffer = req.file?.buffer || null;

    const updatedUser = await AuthService.updateProfileService({
        userId,
        fullname: fullname,
        fileBuffer,
    });

    return success(res, 'Cập nhật profile thành công', updatedUser);
    } catch (err) {
        console.log("Update profile fail:", err.message);
        return error(res, "Update profile fail");
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        await AuthService.changePasswordService({ userId, oldPassword, newPassword });
        return success(res, 'Đổi mật khẩu thành công');
    } catch (err) {
        return error(res, err.message);
    }
};

// Check role
export const checkRole = [ authenticate, (req, res) => {
    try 
    {
        console.log('User role:', req.user.role);
        return success(res, 'Role hiện tại', { role: req.user.role });
    } catch (err) {
        return error(res, err.message, 500);
    }
}];
