import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user.model.js';
import { config } from '../config/env.config.js';
import { OAuth2Client } from "google-auth-library";
import redisClient from '../config/redis.config.js';
import { uploadAvatar } from './cloudinary.service.js';
import { sendOTPEmail, sendResetPasswordEmail } from './mail.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const client = new OAuth2Client(config.googleClientId);

const fullNameRegex = /^[\p{L}\s'-]+$/u;

// Normal Login
export const normalLoginService = async ({ email, password }) => {
    if ( !email || !password ) throw new Error('Vui lòng nhập email và mật khẩu');
    
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email không tồn tại');
    if (!user.isActive) throw new Error('Tài khoản bị vô hiệu hóa!');
    if (user.authType !== 'normal') throw new Error(`Tài khoản này đăng ký bằng ${user.authType}. Vui lòng đăng nhập bằng Google.`);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    const safeUser = { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, avatarUrl: user.avatarUrl, isActive : user.isActive, role: user.role };

    return { user : safeUser, accessToken, refreshToken };
};

// Google Login
export const googleLoginService = async ({ tokenId }) => {
    if (!tokenId) throw new Error("Thiếu token ID");

    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: config.googleClientId
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    
    if (user) {
        if (user.authType === 'normal') throw new Error('Email đã được đăng ký. Vui lòng đăng nhập bằng mật khẩu.');
    } else {
        user = new User({ 
            fullname: name, 
            email, 
            avatarUrl: picture, 
            authType: 'google', 
            password: null, 
            isActive: true 
        });
        await user.save();
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const safeUser = { 
        id: user._id, 
        fullname: user.fullname, 
        email: user.email, 
        phone: user.phone, 
        isActive : user.isActive,
        avatarUrl: user.avatarUrl, 
        role: user.role 
    };

    return { user: safeUser, accessToken, refreshToken };
};

// Register
export const registerService = async ({ fullname, email, password, phone, dob, avatarUrl, otp }) => {
    const storedOtp = await redisClient.get(`otp:${email}`);
    
    if (!storedOtp || storedOtp !== otp) throw new Error('OTP không hợp lệ!');
    
    if (await User.findOne( { email }))  throw new Error('Email tồn tại. Vui lòng sử dụng email khác!');

    if (phone && await User.findOne({ phone })) throw new Error('Số điện thoại đã tồn tại!');

    if (!fullname || !fullNameRegex.test(fullname)) throw new Error('Họ tên chứa ký tự không hợp lệ!');
    
    let dobDate = null;
    if (dob) {
        const [day, month, year] = dob.split('/');
        dobDate = new Date(`${year}-${month}-${day}`); // chuyển sang YYYY-MM-DD
        if (isNaN(dobDate.getTime())) throw new Error('Ngày sinh không hợp lệ!');
    }
    else {
        console.log('Dob null!');
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const user = new User({ fullname, email, password: hashedPassword, phone, dob: dobDate, avatarUrl, authType: 'normal', isVerified: true });
    await user.save();
    await redisClient.del(`otp:${email}`);

    return { user };
};

//Send OTP to email
export const sendRegisterOTPService = async (email) => {
    if (!email) throw new Error('Vui lòng nhập email!');

    if (await User.findOne({ email })) throw new Error('Email đã tồn tại!');

    const existingOtp = await redisClient.get(`otp:${email}`);
    if (existingOtp) await redisClient.del(`otp:${email}`);

    const otp = crypto.randomInt(100000, 999999).toString();
    await redisClient.setEx(`otp:${email}`, 600, otp);

    await sendOTPEmail(email, otp);
    return 'Gửi OTP thành công. Vui lòng kiểm tra email!';
};

//Reset password
export const resetPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (user) {
        const newPassword = crypto.randomBytes(4).toString('hex');
        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await user.save();
        await sendResetPasswordEmail(email, `New password ${newPassword}`);
    }
    return 'Nếu email tồn tại, mật khẩu mới đã được gửi!';
};

//Edit user info (for future use)
export const editInforService = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return { user, accessToken, refreshToken };
};

//Update profile
export const updateProfileService = async ({ userId, fullname, fileBuffer }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    if (fullname && fullname.trim() !== '') {
        user.fullname = fullname;
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
export const changePasswordService = async ({ userId, oldPassword, newPassword }) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Mật khẩu cũ không đúng');

    const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.password = hashedPassword;

    await user.save();

    return { message: 'Đổi mật khẩu thành công',};
};