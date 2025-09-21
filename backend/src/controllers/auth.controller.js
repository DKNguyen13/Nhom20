import * as AuthService from '../services/auth.service.js';
import { success, error } from '../utils/response.js';
import { config } from "../config/env.js";
import axios from "axios";

// Gửi OTP
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const message = await AuthService.sendOTP(email);
        return success(res, message);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

// Đăng ký
export const register = async (req, res) => {
    try {
        const { fullname, email, password, phone, avatar, otp } = req.body;
        const { user, token } = await AuthService.register({ fullname, email, password, phone, avatar, otp });

        return success(res, 'Đăng ký thành công', { 
            user: { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role },
            token
        });
    } catch (err) {
        return error(res, err.message, 400);
    }
};

// Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await AuthService.login({ email, password });

        return success(res, 'Đăng nhập thành công', { 
            user: { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role },
            token
        });
    } catch (err) {
        return error(res, err.message, 400);
    }
};

// Reset mật khẩu
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
        return error(res, err.message, 400);
    }
};