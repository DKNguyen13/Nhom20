import express from 'express';
import cors from 'cors';
import { config } from "./config/env.js";
import { createAdminIfNotExist } from './services/auth.service.js';
import connectDB from './config/db.js';
import examRouter from './routes/exam.routes.js';
import TestRoutes from './routes/TestRoutes.js';

import authRoutes from './routes/auth.routes.js';
import { seedPackages } from './services/premiumPackage.service.js';
import wishlistRouter from './routes/wishlist.routes.js';

const app = express()

const corsOptions = {
    origin: "http://localhost:3000", // chỉ cho phép frontend ở port 3000
    credentials: true,// bắt buộc để gửi cookie
};

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/exams', examRouter)
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRouter)
app.use('/api/test', TestRoutes);

await connectDB();
await createAdminIfNotExist();
await seedPackages();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
export default app;
