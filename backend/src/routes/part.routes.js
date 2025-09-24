import express from 'express';
import { createPart, deletepart, getAllParts, getPartById, updatePart } from '../controllers/part.controller';

const router = express.Router();

// Get all part
router.get('/api/test/:slug/parts', getAllParts);

// Get part by id
router.get('/api/part/:id', getPartById);

// Create part
router.post('/api/test/:testId/part', createPart);

// Update part
router.put('/api/part/:id', updatePart);

// Delete part
router.delete('/api/part/:id', deletepart);

export default router;