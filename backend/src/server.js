import express from 'express';
import cors from 'cors';
import { config } from "../config/env.js";
import connectDB from '../config/db.js';
import examRouter from './routes/exam.routes.js';



const app = express()

const corsOptions = {
    origin: "http://localhost:3000", // chỉ cho phép frontend ở port 3000
};

app.use(cors(corsOptions));
app.use(express.json());


app.use('/exams', examRouter)

await connectDB()
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})
export default app;
