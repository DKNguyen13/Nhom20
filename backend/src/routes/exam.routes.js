import express from 'express';
import {getRecentExam, getMostSolvedExam, getMostViewedExam} from '../controllers/exam.controller.js';

const router = express.Router()

router.get('/recent', getRecentExam)
router.get('/most-viewed', getMostViewedExam)
router.get('/most-solved', getMostSolvedExam)
export default router;