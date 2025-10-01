import mongoose from 'mongoose';
import slug from "mongoose-slug-updater";

// Add plugin
mongoose.plugin(slug);

const { Schema } = mongoose;

const questionSchema = new mongoose.Schema({
    testId: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    partId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part',
        required: true
    },
    title: { type: String, require: true, trim: true },
    partNumber: { type: Number, min: 1, max: 7, require: true },
    questionNumber: {
        type: Number,
        required: true
    },
    globalQuestionNumber: {
        type: Number,
        required: true
    },
    content: {
        type: {
            type: String,
            enum: ['single-choice'],
            default: 'single-choice'
        },
        question: {
            type: String,
            required: true
        },
        image: String, // url img
        audio: String, // url audio
        audioStartTime: Number,
        audioEndTime: Number
    },
    choices: [{
        label: {
            type: String,
            required: true,
            enum: ['A', 'B', 'C', 'D']
        },
        text: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    correctAnswer: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D']
    },
    explanation: String,

}, {
    timestamps: true
})

// Indexes
questionSchema.index({ testId: 1, partNumber: 1, questionNumber: 1 });
questionSchema.index({ partId: 1, questionNumber: 1 });

export default mongoose.model('Question', questionSchema);