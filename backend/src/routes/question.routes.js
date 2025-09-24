import express from 'express';
import { createQuestions, getAllQuestionByPart, getAllQuestionByTest } from '../controllers/question.controller';


const router = express.Router();

// Lấy tất cả questions trong 1 test
router.get('/api/test/:slug/questions', getAllQuestionByTest);

// Lấy tất cả questions trong 1 part (thuộc test)
router.get('/api/test/:slug/parts/:partId/questions', getAllQuestionByPart);

// Lấy chi tiết 1 question
// router.get('/api/test/:testId/parts/:partId/questions/:questionId', getQuestionById);

// Tạo question trong part
router.post('/api/test/:slug/parts/:partId/questions', createQuestions);

// Cập nhật question
// router.put('/api/test/:testId/parts/:partId/questions/:questionId', updateQuestion);

// Xóa question
// router.delete('/api/test/:testId/parts/:partId/questions/:questionId', deleteQuestion);

export default router;