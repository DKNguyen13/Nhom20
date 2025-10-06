import User from '../models/user.model.js';
import Flashcard from '../models/flashcard.model.js';
import { success, error } from '../utils/response.js';

// Create flash
export const createFlashcard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) return error(res, 'Không tìm thấy người dùng!', 404);

    const count = await Flashcard.countDocuments({ user: userId });

    let limit = 5;
    if (user.vip.isActive) {
        switch (user.vip.type) {
            case 'basic': limit = 100; break;
            case 'pro': limit = 500; break;
            case 'premium': limit = 1000; break;
        }
    }

    if (count >= limit) return error(res, `Bạn đã đạt giới hạn ${limit} flashcard. Nâng cấp VIP để tạo thêm!`, 403);

    const flashcard = await Flashcard.create({
        user: userId,
        word: req.body.word,
        meaning: req.body.meaning,
        example: req.body.example,
        note: req.body.note
    });

    return success(res, 'Tạo flash card thành công', flashcard, 201);
    } catch (err) {
        console.error(err);
        return error(res, 'Lỗi khi tạo flashcard.');
    }
};

// Get all flashcards of current user
export const getAllFlashcards = async (req, res) => {
  try {
    const userId = req.user.id;
    const flashcards = await Flashcard.find({ user: userId }).sort({ createdAt: -1 });

    return success(res, 'Lấy danh sách flashcard thành công', flashcards);
  } catch (err) {
    console.error(err);
    return error(res, 'Lỗi khi lấy danh sách flashcard.');
  }
};

// Delete flashcard
export const deleteFlashcard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const flashcard = await Flashcard.findOneAndDelete({ _id: id, user: userId });
    if (!flashcard) return error(res, 'Không tìm thấy flashcard để xóa!', 404);

    return success(res, 'Xóa flashcard thành công');
  } catch (err) {
    console.error(err);
    return error(res, 'Lỗi khi xóa flashcard.');
  }
};