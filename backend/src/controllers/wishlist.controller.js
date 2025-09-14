import wishListModel from '../models/wishlist.models.js';
import examModels from "../models/exam.models.js";
export const addNewWishList = async (req, res) => {
    try {
        const userId = req.user.id;
        const examId = req.query.examId;

        const wishlist = {userId: userId, examId: examId};
        const saved = await wishListModel.create(wishlist);
        return res.status(200).json(saved);
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getWishlistExam = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await wishListModel.find({userId: userId});
        let listExam = [];
        for (const item of wishlist) {
            const exam = await examModels.findById(item.examId);
            listExam.push(exam);
        }
        return res.status(200).json({data: listExam});
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const isInWishList = async (examId, userId) => {
    try{
        const wishList = await wishListModel.findOne({examId: examId, userId: userId});
        return wishList != null;
    }
    catch (error) {
        throw error;
    }
}