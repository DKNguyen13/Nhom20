import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort || 587,
  secure: false,
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

export const sendOTPEmail = async (to, otp) => {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #1a73e8;">Toeic Master - OTP Xác Thực</h2>
    <p>Bạn yêu cầu gửi mã OTP để xác thực tài khoản.</p>
    <p style="font-size: 20px; font-weight: bold; background: #f0f4ff; padding: 10px; display: inline-block; border-radius: 5px;">
      ${otp}
    </p>
    <p>Mã sẽ hết hạn sau <b>10 phút</b>.</p>
    <p>Nếu bạn không yêu cầu OTP, vui lòng bỏ qua email này.</p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Toeic Master" <${config.mailUser}>`,
    to,
    subject: "OTP Xác Thực Tài Khoản",
    html: htmlContent,
  });

  console.log(`OTP sent to ${to}: ${otp}`);
};

export const sendResetPasswordEmail = async (to, newPassword) => {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #1a73e8;">Toeic Master - Mật Khẩu Mới</h2>
    <p>Bạn vừa yêu cầu <b>reset mật khẩu</b>.</p>
    <p style="font-size: 20px; font-weight: bold; background: #f0f4ff; padding: 10px; display: inline-block; border-radius: 5px;">
      ${newPassword}
    </p>
    <p>Hãy đăng nhập và đổi mật khẩu sau khi nhận được email này.</p>
    <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng liên hệ support ngay lập tức.</p>
    <a href="http://localhost:3000/login" style="display: inline-block; margin-top: 10px; background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đăng Nhập</a>
  </div>
  `;

  await transporter.sendMail({
    from: `"Toeic Master" <${config.mailUser}>`,
    to,
    subject: "Mật Khẩu Mới",
    html: htmlContent,
  });

  console.log(`Reset password sent to ${to}`);
};
