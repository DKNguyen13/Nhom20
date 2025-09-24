// import Exam from '../models/exam.models.js';
// import {parsePaginate} from '../helpers/parsePaginate.js';
// import {isInWishList} from "./wishlist.controller.js";

// export const getRecentExam = async (req, res) => {
//     let { page, limit } = parsePaginate(req.query);
//     page = 1;
//     limit = 8;
//     const [items, total] = await Promise.all([
//         Exam.find({})
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//         Exam.countDocuments({}),
//     ]);
//     return res.json({ page, limit, total, items });
// }

// export const getMostViewedExam = async (req, res) => {
//     let { page, limit } = parsePaginate(req.query);
//     page = 1;
//     limit = 8;
//     const [items, total] = await Promise.all([
//       Exam.find({})
//         .sort({ views: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//       Exam.countDocuments({}),
//     ]);
//     return res.json({ page, limit, total, items });
// }

// export const getMostSolvedExam = async (req, res) => {
//     let { page, limit } = parsePaginate(req.query);
//     page = 1;
//     limit = 8;
//     const [items, total] = await Promise.all([
//       Exam.find({})
//         .sort({ solves: -1, createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//       Exam.countDocuments({}),
//     ]);
//     return res.json({ page, limit, total, items });
// }

// export const getExam = async (req, res) => {
//     let userId = null
//     if (req.user){
//         userId = req.user.id;
//     }
//     let { sortBy, page, limit } = parsePaginate(req.query);
//     if (!limit){
//         limit = 6;
//     }
//     let sortOption;
//     switch (sortBy) {
//         case 'newest':
//             sortOption = { createdAt: -1 }; // Mới nhất
//             break;
//         case 'most_solved':
//             sortOption = { solves: -1, createdAt: -1 }; // Nhiều người làm nhất, sau đó theo thời gian
//             break;
//         case 'most_viewed':
//             sortOption = { views: -1, createdAt: -1 }; // Nhiều người xem nhất, sau đó theo thời gian
//             break;
//         case 'oldest':
//             sortOption = { createdAt: 1 }; // Cũ nhất (optional)
//             break;
//         default:
//             sortOption = { createdAt: -1 };
//     }

//     const [items, total] = await Promise.all([
//         Exam.find({})
//             .sort(sortOption)
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .lean(),
//         Exam.countDocuments({}),
//     ]);
//     let list = [];
//     if (userId){
//         for (const item of items) {
//             if (await isInWishList(item._id, userId)) {
//                 list.push({...item, isInWishlist: true});
//             }
//             else{
//                 list.push({...item, isInWishlist: false});
//             }
//         }
//     }
//     else{
//         list = items;
//     }
//     return res.json({ page, limit, total, items: list });
// }