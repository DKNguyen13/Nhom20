import AuthService from '../services/authService.js';
import { config } from "../config/env.js";
import { generateToken } from '../utils/jwt.js';
import axios from "axios";

class AuthController {

    static async sendOTP(req, res) {
        try {
            const { email } = req.body;
            const result = await AuthService.sendOTP(email);

            res.json({ success: true, message: 'Send OTP', data: { email: result.email } });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { fullname, email, password, phone, avatar, otp } = req.body;
            const user = await AuthService.register({ fullname, email, password, phone, avatar, otp });

            res.status(201).json({
                success: true,
                message: 'Register successful. Please login.',
                data: {
                    user: {
                        id: user._id,
                        fullname: user.fullname,
                        email: user.email,
                        phone: user.phone,
                        avatar: user.avatar,
                        role: user.role
                    },
                }
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.login({ email, password });

            const token = generateToken({ id: user._id, role: user.role });

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        fullname: user.fullname,
                        email: user.email,
                        phone: user.phone,
                        avatar: user.avatar,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async resetPassword(req, res) {
        const { email, token } = req.body;

        try {
            //Verify CAPTCHA với Google
            const secretKey = config.recaptchaSecret;
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
            );

            if (!response.data.success) throw new Error("CAPTCHA không hợp lệ");

            const result = await AuthService.resetPassword({ email });
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

export default AuthController;
