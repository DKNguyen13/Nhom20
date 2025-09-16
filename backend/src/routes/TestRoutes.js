import express from 'express';

import { getTestDetail } from '../controllers/TestController.js';

const router = express.Router();

router.get('/detail/:slug', getTestDetail);

export default router;
