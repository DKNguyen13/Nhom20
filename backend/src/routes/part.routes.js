import express from 'express';
import { createPart, deletePart, getAllParts, getPartById, updatePart } from '../controllers/part.controller';

const router = express.Router();

// Get all part
router.get('/api/test/:slug/parts', getAllParts);

// Get part by id
router.get('/api/test/:slug/parts/:partId', getPartById);

// Create part
router.post('/api/test/:slug/parts', createPart);

// Update part
router.put('/api/test/:slug/parts/:partId', updatePart);

// Delete part
router.delete('/api/test/:slug/part/:partId', deletePart);

export default router;