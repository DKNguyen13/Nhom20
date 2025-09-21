import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import redisClient from '../config/redis.js';
import crypto from 'crypto';
import { sendOTPEmail, sendResetPasswordEmail } from './mail.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const sendOTP = async (email) => {
    if (await User.findOne({ email })) throw new Error('Email đã tồn tại');

    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) await redisClient.del(`otp:${email}`);

    const otp = crypto.randomInt(100000, 999999).toString();
    await redisClient.setEx(`otp:${email}`, 600, otp);

    await sendOTPEmail(email, otp);
    return 'OTP đã được gửi';
};

export const register = async ({ fullname, email, password, phone, avatar, otp }) => {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) throw new Error('OTP không hợp lệ hoặc đã hết hạn');

    if (await User.findOne({ email })) throw new Error('Email đã tồn tại');
    if (phone && await User.findOne({ phone })) throw new Error('Số điện thoại đã tồn tại');

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const user = new User({ fullname, email, password: hashedPassword, phone, avatar, isVerified: true });
    await user.save();
    await redisClient.del(`otp:${email}`);

    const token = generateToken({ id: user._id, role: user.role });

    return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu không đúng');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  return { user, accessToken, refreshToken };
};

export const resetPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (user) {
        const newPassword = crypto.randomBytes(4).toString('hex');
        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await user.save();
        await sendResetPasswordEmail(email, `Mật khẩu mới của bạn là: ${newPassword}`);
    }

    return 'Mật khẩu mới đã được gửi nếu email tồn tại';
};