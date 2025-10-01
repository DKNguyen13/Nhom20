import express from "express";
import Comment from "../models/comment.model.js";
import {
    addComment,
    deleteComment, getChildrenComment,
    getCommentsByExamId, reactComment,
    replyComment,
    updateComment
} from "../controllers/comment.controller.js";
import {authenticate, optionalAuth} from "../middleware/authenticate.js";

const router = express.Router();

// Get comments by exam ID
router.get("/test/:examId", optionalAuth, getCommentsByExamId);

// Add new comment
router.post("/", authenticate, addComment);

// Update comment
router.put("/:id", authenticate, updateComment);

// Delete comment
router.delete("/:id", authenticate, deleteComment);

// Reply to a comment
router.post("/:id/reply", authenticate, replyComment);

// Get child comments for a specific comment
router.get("/:id/replies", optionalAuth, getChildrenComment)

router.post("/:id/react", authenticate, reactComment);
export default router;
