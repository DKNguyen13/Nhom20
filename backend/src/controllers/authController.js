import AuthService from '../services/authService.js';
import { generateToken } from '../utils/jwt.js';

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
}

export default AuthController;
