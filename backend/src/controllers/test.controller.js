import { success, fail } from '../helpers/responseHelper.js';

import Test from "../models/test.model.js";
import Part from "../models/part.model.js";
import Question from "../models/question.model.js";

// [GET] /api/test
export const getAllTest = async (req, res) => {
    try {
        const tests = await Test.find();
        if (!tests) {
            return fail(res, 'Error fetching tests');
        }
        return success(res, { tests });

    } catch (error) {
        return fail(res, 'Get all test fail', error.message);
    }
};

// [GET] /api/test/:slug
export const getTestDetail = async (req, res) => {
    try {

        const { slug } = req.params;

        const test = await Test.findOne({ slug });

        if (!test) {
            return fail(res, 'Test not found');
        }

        // Get part and questions
        const parts = await Part.find({ testId: test._id })
            .sort({ partNumber: 1 });

        const questions = await Question.find({ testId: test._id })
            .sort({ partNumber: 1, questionNumber: 1 });

        return success(res, {
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
        return fail(res, 'Error fetching test', error.message);
    }
};

// [POST] /api/test/create
export const createTest = async (req, res) => {
    try {
        // validate input


        const testData = {
            ...req.body,
            createdBy: req.user._id,
            publishedAt: req.body.isActive ? new Date() : null,
        };

        const test = new Test(testData);
        await test.save();

        return success(res, { test });
    } catch (error) {
        return fail(res, 'Fail Create Test', error.message);
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
            return fail(res, 'Test not found');
        }

        return success(res, { test })
    } catch (error) {
        return fail(res, 'Update test fail', error.message);
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
            return fail(res, 'Test not found');
        }

        return success(res, { test });
    } catch (error) {
        return fail(res, 'Delete test fail', error.message);
    }
};
