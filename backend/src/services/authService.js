import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import redisClient from '../config/redis.js';
import crypto from 'crypto';
import { sendOTPEmail, sendResetPasswordEmail } from './mailService.js';

class AuthService {
    static async sendOTP(email) {
        if (await User.findOne({ email })) throw new Error('Email exists');

        const existingOtp = await redisClient.get(`otp:${email}`);
        if (existingOtp) await redisClient.del(`otp:${email}`);

        const otp = crypto.randomInt(100000, 999999).toString();
        await redisClient.setEx(`otp:${email}`, 600, otp); // TTL 10 phút

        await sendOTPEmail(email, otp);

        return { email, otp };
    }
    
    static async register({ fullname, email, password, phone, avatar, otp }) {
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp) throw new Error('OTP not exits or expired');
        if (storedOtp !== otp) throw new Error('OTP incorrect');

        if (await User.findOne({ email })) throw new Error('Email exists');
        if (phone && await User.findOne({ phone })) throw new Error('Phone exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ fullname, email, password: hashedPassword, phone, avatar, isVerified: true });
        await user.save();

        await redisClient.del(`otp:${email}`);

        return user;
    }

    static async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Email not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Password incorrect');

        return user;
    }
    
    static async resetPassword({ email }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Mật khẩu mới đã được gửi nếu email tồn tại');

        const newPassword = crypto.randomBytes(4).toString('hex');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        await sendResetPasswordEmail(email, `Mật khẩu mới của bạn là: ${newPassword}`);

        return { message: 'Mật khẩu mới đã được gửi nếu email tồn tại' };
    }

}

export default AuthService;