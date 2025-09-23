import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as LessonController from '../controllers/lesson.controller.js';

const router = express.Router();

router.post('/', LessonController.createLesson);
router.get('/', LessonController.getLessons);
router.get('/:id', LessonController.getLessonById);

router.put('/:id',authenticate, LessonController.updateLesson);

router.patch('/:id/delete', authenticate, LessonController.deleteLesson);

export default router;