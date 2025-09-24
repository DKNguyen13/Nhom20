import express from 'express';

import { createTest, deleteTest, getAllTest, getTestDetail, updateTest } from '../controllers/test.controller.js';

const router = express.Router();

router.get('/', getAllTest);
router.get('/:slug', getTestDetail);
router.post('/', createTest);
router.put('/:slug', updateTest);
router.delete('/:slug', deleteTest);

export default router;
