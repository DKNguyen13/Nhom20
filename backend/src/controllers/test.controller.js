import Test from "../models/test.model.js";
import Part from "../models/part.model.js";
import Question from "../models/question.model.js";
import { success, error } from '../utils/response.js';

// [GET] /api/test
export const getAllTest = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tests = await Test.find()
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit);
        const total = await Test.countDocuments();
        if (!tests) {
            return fail(res, 'Error fetching tests');
        }
        return success(res, 'Get all test success', {
            tests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTests: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });

    } catch (err) {
        return error(res, 'Get all test error', 500, err.message);
    }
};

// [GET] /api/test/:slug
export const getTestDetail = async (req, res) => {
    try {

        const { slug } = req.params;

        const test = await Test.findOne({ slug });

        if (!test) {
            return error(res, 'Test not found');
        }

        // Get part and questions
        const parts = await Part.find({ testId: test._id })
            .sort({ partNumber: 1 });

        const questions = await Question.find({ testId: test._id })
            .sort({ partNumber: 1, questionNumber: 1 });

        return success(
            res,
            'Get test detail success',
            {
                test,
                parts,
                questions,
                summary: {
                    totalPart: parts.length,
                    totalQuestions: questions.length,
                    questionByPart: parts.map(part => ({
                        partNumber: part.partNumber,
                        title: part.title,
                        questionCount: questions.filter(q => q.partNumber === part.partNumber)
                    }))
                }
            });
    } catch (error) {
        return error(res, 'Error fetching test');
    }
};

// [POST] /api/test/create
export const createTest = async (req, res) => {
    try {
        // validate input
        const testData = {
            ...req.body,
            createdBy: "68eb4512e2e81f8ebfe609b2",
            publishedAt: req.body.isActive ? new Date() : null,
        };

        const test = new Test(testData);
        await test.save();

        return success(res, 'Create test success', { test });
    } catch (err) {
        return error(res, 'error Create Test', 500, err.message);
    }
};

// [PUT] /api/test/:slug
export const updateTest = async (req, res) => {
    try {
        // validate input
        const { slug } = req.params;
        const updateData = { ...req.body };

        const test = await Test.findOneAndUpdate(
            { slug },
            updateData,
            { new: true, runValidators: true },
        ).populate('createdBy', 'fullname email');

        if (!test) {
            return error(res, 'Test not found');
        }

        return success(res, 'Update test success', { test })
    } catch (error) {
        return error(res, 'Update test error');
    }
};

// [DELETE] /api/test/:slug
export const deleteTest = async (req, res) => {
    try {
        // Soft delete
        const { slug } = req.params;
        const test = await Test.findOneAndUpdate(
            { slug },
            { isActive: false },
            { new: true }
        );

        if (!test) {
            return error(res, 'Test not found');
        }

        return success(res, 'Delete test success');
    } catch (error) {
        return error(res, 'Delete test error');
    }
};
