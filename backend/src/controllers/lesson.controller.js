import Lesson from "../models/lesson.model.js";
import Wishlist from '../models/wishlist.models.js';
import { success, error } from '../utils/response.js';

// Create lesson
export const createLesson = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return error(res, 'Không có quyền truy cập', 403);
    const lesson = new Lesson({
      ...req.body,// copy toàn bộ dữ liệu client gửi lên
      createdBy: req.user._id,
    });
    await lesson.save();
    return success(res, "Tạo lesson thành công", lesson);
  } catch (err) {
    return error(res, err.message, 400);}
};

// Get all lessons excluding deleted ones
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ isDeleted: false });
    
    const lessonsWithFavorite = await Promise.all(
      lessons.map(async (lesson) => {
        const favoriteCount = await Wishlist.countDocuments({ lesson: lesson._id });
        let isFavorite = false;
        if (req.user) {
          const exists = await Wishlist.exists({ user: req.user._id, lesson: lesson._id });
          isFavorite = !!exists;
        }
        return {
          ...lesson.toObject(),
          views: lesson.views || 0,
          favoriteCount,
          isFavorite
        };
      })
    );

    return success(res, 'Lấy danh sách lesson thành công', lessonsWithFavorite);
  } catch (err) {
    console.log(err.message);
    return error(res, "Lỗi lấy danh sách các bài học", 500);
  }
};


// Get lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ _id: req.params.id, isDeleted: false });
    if (!lesson) return error(res, "Lesson không tìm thấy", 404);
    const favoriteCount = await Wishlist.countDocuments({ lesson: lesson._id });

    let isFavorite = false;
    if (req.user) {
      const exists = await Wishlist.exists({ user: req.user._id, lesson: lesson._id });
      isFavorite = !!exists;
    }

    return success(res, 'Lấy lesson thành công', {...lesson.toObject(), favoriteCount, isFavorite });
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return error(res, 'Không có quyền truy cập', 403);
    const lesson = await Lesson.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!lesson) return error(res, "Lesson không tìm thấy", 404);
    return success(res, 'Cập nhật lesson thành công', lesson);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Soft delete lesson
export const deleteLesson = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return error(res, 'Không có quyền truy cập', 403);
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!lesson) return error(res, "Lesson không tìm thấy", 404);
    return success(res, 'Xóa lesson thành công');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

// Increase view
export const incrementViews = async (req, res) => {
  try {
    const lesson = await Lesson.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!lesson) return error(res, "Lesson không tìm thấy", 404);

    return success(res, "Tăng views thành công", { views: lesson.views });
  } catch (err) {
    return error(res, err.message, 400);
  }
};
