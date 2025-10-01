import axios from "axios";
import { config } from "../config/env.config.js";
import { success, error } from '../utils/response.js';
import * as AuthService from '../services/auth.service.js';
import * as AdminService from '../services/admin.service.js';
import { authenticate } from '../middleware/authenticate.js';

// Send OTP to email
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const message = await AuthService.sendOTP(email);
        return success(res, message);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

// Register
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

// Login
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
      user: { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, avatarUrl : user.avatarUrl, role: user.role },
      accessToken
    });
  } catch (err) {
    return error(res, err.message, 400);
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
        return error(res, err.message, 400);
    }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
    });
    
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

// Cập nhật thông tin cá nhân
export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const fullname = req.body.fullname || '';
    const fileBuffer = req.file?.buffer || null;

    const updatedUser = await AuthService.updateProfile({
      userId,
      fullName: fullname,
      fileBuffer,
    });

    return success(res, 'Cập nhật profile thành công', updatedUser);
  } catch (err) {
    return error(res, err.message);
  }
};

// Đổi mật khẩu
export const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    await AuthService.changePassword({ userId, oldPassword, newPassword });
    return success(res, 'Đổi mật khẩu thành công');
  } catch (err) {
    return error(res, err.message);
  }
};

export const checkRole = [
  authenticate,
  (req, res) => {
    try {
      console.log('User role:', req.user.role);
      return success(res, 'Role hiện tại', { role: req.user.role });
    } catch (err) {
      return error(res, err.message, 500);
    }
  }
];

//Admin: Get all users (with pagination, exclude admins)
export const getAllUsersController = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return error(res, 'Không có quyền truy cập', 403);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await AdminService.getAllUsers(page, limit);
    return success(res, 'Danh sách người dùng', data);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

//Inactivate user (admin only)
export const changeActivateUserController = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return error(res, 'Không có quyền truy cập', 403);
        }
        const { email } = req.body;
        const message = await AdminService.changeActivateUser(email);
        return success(res, message);
    }
    catch (err) {
        return error(res, err.message, 500);
    }
};
