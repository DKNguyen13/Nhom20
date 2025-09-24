import express from 'express';

import { createTest, deleteTest, getAllTest, getTestDetail, updateTest } from '../controllers/test.controller.js';

const router = express.Router();

router.get('/', getAllTest);
router.post('/create', createTest);
router.get('/detail/:slug', getTestDetail);
router.put('/:id', updateTest);
router.delete(':id', deleteTest);

export default router;
