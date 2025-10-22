import express from 'express';

import { createTest, deleteTest, getAllTest, getTestDetail, updateTest } from '../controllers/test.controller.js';
import {authenticate, isAdmin} from "../middleware/authenticate.js";
import { upload } from '../middleware/upload.middleware.js';
const router = express.Router();

router.get('/', getAllTest);
router.get('/:slug', getTestDetail);
router.post('/', authenticate, isAdmin , upload.any(), createTest);
router.put('/:slug', updateTest);
router.delete('/:slug', deleteTest);

export default router;
