import express from 'express';
import * as WishlistController from "../controllers/wishlist.controller.js";
import {authenticate} from "../middleware/authenticate.js";

const router = express.Router()

router.patch('/toggle', authenticate, WishlistController.toggleWishlist);
router.get('/:lessonId', authenticate, WishlistController.getLessonFavorite);

export default router;