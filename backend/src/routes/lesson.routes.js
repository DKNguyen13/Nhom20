import multer from "multer";
import express from 'express';
import { authenticate, optionalAuth } from '../middleware/authenticate.js';
import * as LessonController from '../controllers/lesson.controller.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/', LessonController.createLesson);
router.post("/upload", authenticate,upload.single("file"), LessonController.uploadLesson);

router.get('/', optionalAuth, LessonController.getLessons);
router.get('/:id', optionalAuth, LessonController.getLessonById);

router.put('/:id', authenticate, LessonController.updateLesson);

router.patch('/:id/delete', authenticate, LessonController.deleteLesson);
router.patch('/:id/views', LessonController.incrementViews);

export default router;