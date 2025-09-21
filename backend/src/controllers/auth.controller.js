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
        const { user } = await AuthService.register({ fullname, email, password, phone, avatar, otp });

        return success(res, 'Đăng ký thành công', { 
            user: { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role }
        });
    } catch (err) {
        return error(res, err.message, 400);
    }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return success(res, 'Đăng nhập thành công', { 
      user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role },
      accessToken
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

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie('refreshToken');
    return success(res, 'Đăng xuất thành công');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Refresh Access Token
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

    return success(res, 'Access token mới', { accessToken });
  } catch (err) {
    return error(res, 'Refresh token không hợp lệ hoặc hết hạn', 401);
  }
};