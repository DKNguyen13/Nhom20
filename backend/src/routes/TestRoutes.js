import express from 'express';

import { createTest, getAllTest, getTestDetail } from '../controllers/TestController.js';

const router = express.Router();

router.post('/create', createTest);
router.get('/', getAllTest);
router.get('/detail/:slug', getTestDetail);

export default router;
