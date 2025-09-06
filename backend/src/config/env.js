import dotenv from 'dotenv'
dotenv.config()
export const config = {
    mongodbUri: process.env.MONGODB_URI,
    port: process.env.PORT || 5000,
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenLife: process.env.ACCESS_TOKEN_LIFE || '2d',
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    recaptchaSecret: process.env.RECAPTCHA_SECRET_KEY
}

