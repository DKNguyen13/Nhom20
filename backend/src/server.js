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
import sessionRoutes from "./routes/session.routes.js";
import flashcardRoutes from './routes/flashcard.routes.js';
import flashcardSetRoutes from './routes/flashcardSet.routes.js';
import { Server } from "socket.io";
import { GoogleGenAI } from "@google/genai";
import { promptPrefix } from "./utils/constant.js";

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
// app.use('/api/chat', chatbotRoute);
app.use('/api/test', testRoutes);
app.use('/api/test/:slug', partRoutes);
app.use('/api/test/:slug', questionRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/flashcard', flashcardRoutes);
app.use('/api/flashcard-set', flashcardSetRoutes);

await connectDB();
await InitData.createAdminIfNotExist();
await InitData.seedPackages();
await InitData.seedLessons();
await InitData.seedFlashcards();
//await InitData.seedRevenue();
//await InitData.syncMeiliUsersOnce();
//await InitData.seedScoreMappings();

function chat(){
    const io = new Server(8081, {
        cors: {
            origin: "*",          // Cho phép mọi nguồn truy cập (FE mở file local cũng được)
            methods: ["GET", "POST"]
        }
    });
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    io.on('connection', socket => {
        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            config: {
                temperature: 0.5,
                maxOutputTokens: 1024,
            }
        })
        socket.on('message', async (message) => {
            // const extraPrompt = "Hãy hình dung bạn là một người thầy dạy học tiếng anh, bạn hãy trả lời câu hỏi" +
            //     " hoặc làm theo các yêu cầu bên dưới ngắn gọn và dễ hiểu." +
            //     "Nếu như câu hỏi không liên quan đến tiếng anh, hãy từ chối trả lời một cách lịch sự. Bạn chỉ trả lời thôi, đừng giới thiệu bạn là ai"
            // message = extraPrompt + message;
            message = promptPrefix + message;
            console.log(message)
            const response = await chat.sendMessage({message: message});
            console.log(response.text)
            socket.emit('response', response.text);
        });
    })
}
chat()

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

export default app;
