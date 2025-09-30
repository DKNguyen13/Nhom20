import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { config } from "./config/env.js";
//import examRouter from './routes/exam.routes.js';
import authRouter from './routes/auth.routes.js';
import lessonRouter from './routes/lesson.route.js';
import wishlistRouter from './routes/wishlist.routes.js';
import { createAdminIfNotExist } from './services/auth.service.js';
import { seedPackages } from './services/premiumPackage.service.js';
import vipRouter from './routes/vipPackage.routes.js'
import { seedLessons } from './services/lesson.service.js';

const app = express()

const corsOptions = {
    origin: "http://localhost:3000", // chỉ cho phép frontend ở port 3000
    credentials: true,// bắt buộc để gửi cookie
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/lessons', lessonRouter);
//app.use('/api/exams', examRouter);
app.use('/api/auth', authRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/vip', vipRouter);

await connectDB();
await createAdminIfNotExist();
await seedPackages();
//await seedLessons();//fake data

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
export default app;
