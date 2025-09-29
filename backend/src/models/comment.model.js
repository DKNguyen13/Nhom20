import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    noOfLikes: {
        type: Number,
        default: 0
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    noOfChildren: {
        type: Number,
        default: 0
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    isParent: {
        type: Boolean,
        default: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    }
}, {
    timestamps: true
});

commentSchema.pre("deleteOne", async function() {
    const commentId = this.getQuery()._id;
    
    // Xóa tất cả comment con
    await mongoose.model('Comment').deleteMany({ parent: commentId });
});

export default mongoose.model('Comment', commentSchema);
