import mongoose from "mongoose";
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('Wishlist', wishlistSchema);