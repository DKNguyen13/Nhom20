import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.config.js';
import { config } from './config/env.config.js';
import authRouter from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import partRoutes from './routes/part.routes.js';
import adminRouter from './routes/admin.routes.js';
import vnpayRoutes from './routes/vnpay.routes.js';
import commentRoute from './routes/comment.route.js';
import lessonRouter from './routes/lesson.routes.js';
import vipRouter from './routes/vipPackage.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import questionRoutes from './routes/question.routes.js';
import * as InitData from './services/initData.service.js';
import sessionRoutes from './routes/session.routes.js';

const app = express()

const corsOptions = {
    origin: "http://localhost:3000", // chỉ cho phép frontend ở port 3000
    credentials: true,// bắt buộc để gửi cookie
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/vip', vipRouter);
app.use("/api/payment", vnpayRoutes);
app.use('/api/comments', commentRoute);
app.use('/api/test', testRoutes);
app.use('/api/test/:slug', partRoutes);
app.use('/api/test/:slug', questionRoutes);
app.use('/api/session', sessionRoutes);

await connectDB();
await InitData.createAdminIfNotExist();
await InitData.seedPackages();
await InitData.seedLessons();
await InitData.seedRevenue();
await InitData.seedScoreMappings();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

export default app;
