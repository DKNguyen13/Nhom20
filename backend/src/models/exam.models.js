import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    title: String,
    image: String,
    questions: Number, //so luong question
    students: Number,
    level: String,
    audio: String,
    views: { type: Number, default: 0 },
    solves: { type: Number, default: 0 },
}, {
    timestamps: true //auto generate createAt and updateAt
})

export default mongoose.model('Exam', examSchema);
