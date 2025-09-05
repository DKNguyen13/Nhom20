import express from 'express';
import {getRecentExam, getMostSolvedExam, getMostViewdExam} from '../controllers/exam.controller.js';

const router = express.Router()

router.get('/recent', getRecentExam)
router.get('/most-viewed', getMostViewdExam)
router.get('/most-solved', getMostSolvedExam)
export default router;