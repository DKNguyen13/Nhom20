import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import redisClient from '../config/redis.js';
import User from '../models/user.models.js';
import { uploadAvatar } from './cloudinary.service.js';
import { sendOTPEmail, sendResetPasswordEmail } from './mail.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

//Send OTP to email
export const sendOTP = async (email) => {
    if (await User.findOne({ email })) throw new Error('Email đã tồn tại');

    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) await redisClient.del(`otp:${email}`);

    const otp = crypto.randomInt(100000, 999999).toString();
    await redisClient.setEx(`otp:${email}`, 600, otp);

    await sendOTPEmail(email, otp);
    return 'OTP đã được gửi';
};

//Register
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

//Login
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu không đúng');
  if (!user.isActive) throw new Error('Tài khoản đã bị vô hiệu hóa');
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  return { user, accessToken, refreshToken };
};

//Edit user info (for future use)
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

//Update profile
export const updateProfile = async ({ userId, fullName, fileBuffer }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  if (fullName && fullName.trim() !== '') {
    user.fullname = fullName;
  }

  if (fileBuffer) {
    const avatarUrl = await uploadAvatar(fileBuffer);
    user.avatarUrl = avatarUrl;
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

//Change password
export const changePassword = async ({ userId, oldPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Mật khẩu cũ không đúng');

  const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
  user.password = hashedPassword;

  await user.save();

  return {
    message: 'Đổi mật khẩu thành công',
  };
};