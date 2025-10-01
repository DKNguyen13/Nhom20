import express from 'express';
import { createPart, deletePart, getAllParts, getPartById, updatePart } from '../controllers/part.controller.js';

const router = express.Router({ mergeParams: true });

// Get all part
router.get('/parts', getAllParts);

// Get part by id
router.get('/parts/:partId', getPartById);

// Create part
router.post('/parts', createPart);

// Update part
router.put('/parts/:partId', updatePart);

// Delete part
router.delete('/part/:partId', deletePart);

export default router;