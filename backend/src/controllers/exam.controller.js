import Exam from '../models/exam.models.js';
import {parsePaginate} from '../helpers/parsePaginate.js';

export const getRecentExam = async (req, res) => {
    let { page, limit } = parsePaginate(req.query);
    page = 1;
    limit = 8;
    const [items, total] = await Promise.all([
        Exam.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
        Exam.countDocuments({}),
    ]);
    return res.json({ page, limit, total, items });
}

export const getMostViewdExam = async (req, res) => {
    let { page, limit } = parsePaginate(req.query);
    page = 1;
    limit = 8;
    const [items, total] = await Promise.all([
      Exam.find({})
        .sort({ views: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Exam.countDocuments({}),
    ]);
    return res.json({ page, limit, total, items });
}

export const getMostSolvedExam = async (req, res) => {
    let { page, limit } = parsePaginate(req.query);
    page = 1;
    limit = 8;
    const [items, total] = await Promise.all([
      Exam.find({})
        .sort({ solves: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Exam.countDocuments({}),
    ]);
    return res.json({ page, limit, total, items });
}