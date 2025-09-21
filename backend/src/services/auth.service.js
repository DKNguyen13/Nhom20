import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import redisClient from '../config/redis.js';
import User from '../models/user.models.js';
import { uploadAvatar } from './cloudinary.service.js';
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

    return { user };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu không đúng');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  return { user, accessToken, refreshToken };
};

export const editInfor = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu không đúng');

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

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

export const createAdminIfNotExist = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      const admin = new User({
        fullname: 'Super Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        phone: '0123456789',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('Admin mặc định đã được tạo: admin@admin.com / admin@123');
    } else {
      console.log('Admin đã tồn tại, không cần tạo lại.');
    }
  } catch (err) {
    console.error('Lỗi khi tạo admin mặc định:', err);
  }
};

export const updateProfile = async ({ userId, fullName, fileBuffer }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  if (fullName && fullName.trim() !== '') {
    user.fullname = fullName;
  }

  if (fileBuffer) {
    const avatarUrl = await uploadAvatar(fileBuffer);
    user.avatarUrl = avatarUrl; // lưu vào DB
  }

  await user.save();

  return {
    id: user._id.toString(),
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    avatar: user.avatarUrl,
    role: user.role,
  };
};

