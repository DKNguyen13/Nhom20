import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { config } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import vnpayRoutes from "./routes/vnpay.routes.js";
import lessonRouter from './routes/lesson.routes.js';
import vipRouter from './routes/vipPackage.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import * as InitData from './services/initData.service.js';

const app = express()

const corsOptions = {
    origin: "http://localhost:3000", // chỉ cho phép frontend ở port 3000
    credentials: true,// bắt buộc để gửi cookie
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/lessons', lessonRouter);
app.use('/api/auth', authRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/vip', vipRouter);
app.use("/api/payment", vnpayRoutes);
app.use('/api/admin', adminRouter);

await connectDB();
await InitData.createAdminIfNotExist();
await InitData.seedPackages();
await InitData.seedLessons();
await InitData.seedRevenue();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
export default app;
