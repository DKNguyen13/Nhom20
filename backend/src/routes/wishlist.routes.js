import express from 'express';
import {addNewWishList, getWishlistExam} from "../controllers/wishlist.controller.js";
import {authenticate} from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/', authenticate, addNewWishList)
router.get('/', authenticate, getWishlistExam)
export default router;