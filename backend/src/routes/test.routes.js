import express from 'express';

import { createTest, deleteTest, getAllTest, getTestDetail, updateTest } from '../controllers/test.controller.js';

const router = express.Router();

router.get('/api/test', getAllTest);
router.get('/api/test/:slug', getTestDetail);
router.post('/api/test', createTest);
router.put('/api/test/:slug', updateTest);
router.delete('/api/test:slug', deleteTest);

export default router;
