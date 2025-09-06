import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

export const sendOTPEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: config.mailPort || 587,
        secure: false,
        auth: {
            user: config.mailUser,
            pass: config.mailPass
        }
    });

    await transporter.sendMail({
        from: `"Toeic Master" <${config.mailUser}>`,
        to,
        subject: "OTP Xác Thực Tài Khoản",
        html: `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Hết hạn sau 10 phút</p>`
    });

    console.log(`OTP sent to ${to}: ${otp}`);
};
