import Comment from "../models/comment.model.js";

export const getCommentsByExamId = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ exam: req.params.examId, isParent: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments({ exam: req.params.examId, isParent: true });

        res.json({
            data: comments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalComments: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addComment = async (req, res, next) => {
    try {
        const user = req.user;
        const comment = req.body;
        comment.author = user.id;
        let savedComment = await Comment.create(comment)
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const updateComment = async (req, res, next) => {
    try {
        const cmt = req.body;
        cmt.isEdited = true;
        cmt.editedAt = Date.now();
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            cmt,
            { new: true }
        )
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        await Comment.deleteOne(comment);
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const replyComment = async (req, res, next) => {
    try {
        const user = req.user;
        const parentCommentId = req.params.id;
        const reply = req.body;
        console.log("Replying to comment ID:", parentCommentId);
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            return res.status(404).json({ error: "Parent comment not found" });
        }
        reply.author = user.id;
        reply.parent = parentCommentId;
        reply.isParent = false;
        const savedReply = await Comment.create(reply);
        res.json(savedReply);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getChildrenComment = async (req, res, next) => {
    try {
        const parentCommentId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            return res.status(404).json({ error: "Parent comment not found" });
        }

        const replies = await Comment.find({ parent: parentCommentId })
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments({ parent: parentCommentId });

        res.json({
            data: replies,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalComments: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const reactComment = async (req, res, next) => {
    try {
        const user = req.user; // 'like' or 'unlike'
        const commentId = req.params.id;

        let comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const existingReactionIndex = comment.likes.findIndex(like => {
            // console.log(like);
            return like.toString() === user.id
        });
        //user like this comment before
        if (existingReactionIndex !== -1) {
            await Comment.updateOne({_id: commentId},
                {
                    $pull: {likes: user.id},
                    $inc: {noOfLikes: -1}
                });
        }
        else{
            await Comment.updateOne({_id: commentId},
                {
                    $push: {likes: user.id},
                    $inc: {noOfLikes: +1}
                });
        }
        res.json({ message: "Reaction updated successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}