import express from 'express';
import {getRecentExam, getMostSolvedExam, getMostViewdExam, getExam} from '../controllers/exam.controller.js';

const router = express.Router()

router.get('/recent', getRecentExam)
router.get('/most-viewed', getMostViewdExam)
router.get('/most-solved', getMostSolvedExam)
router.get('/', getExam)
export default router;