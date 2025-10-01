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
    // UPDATED: More flexible content structure
    content: {
        question: String, // Main question text
        
        // For Part 1 - Photographs
        image: String,
        
        // For Part 5 - Sentence with blank
        sentence: String, // "The company ____ new employees last month."
        
        // For Part 3, 4 - Conversations/Talks with transcript
        transcript: String,
        transcriptId: String, // To group questions with same transcript
        
        // For Part 6, 7 - Reading passages
        passage: {
            title: String,
            text: String
        },
        passageId: String, // To group questions with same passage
        
        // Audio info (for all listening parts)
        audio: String,
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