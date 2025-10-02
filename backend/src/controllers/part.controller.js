import Test from "../models/test.model.js";
import Part from "../models/part.model.js";
import Question from "../models/question.model.js";
import { success, error } from '../utils/response.js';

// [GET] /api/test/:slug/parts
export const getAllParts = async (req, res) => {
    try {
        const { slug } = req.params;
        const test = await Test.findOne({ slug });

        if (!test) {
            return error(res, 'Test not found');
        }

        // Get part 
        const parts = await Part.find({ testId: test._id }).sort({ partNumber: 1 });

        // Get question for each part
        const partWithCounts = await Promise.all(
            parts.map(async (part) => {
                const questionCount = await Question.countDocuments({ partId: part._id });
                return {
                    ...part.toObject(),
                    questionCount
                }
            })
        )
        return success(
            res,
            'Get all part success',
            {
                test: { slug: test.slug, title: test.title },
                partWithCounts
            });

    } catch (error) {
        return error(res, 'Get all test error');
    }
};

// [GET] /api/test/:slug/parts/:partId
export const getPartById = async (req, res) => {
    try {

        const { slug, partId } = req.params;

        // Check test exists
        const test = await Test.findOne({ slug });

        if (!test) {
            return error(res, 'Test not found');
        }

        const part = await Part.findOne({
            _id: partId,
            testId: test._id
        }).populate('testId', 'title slug');

        if (!part) {
            return error(res, 'Part not found');
        }

        // Get questions for this part
        const questions = await Question.find({ partId })
            .sort({ questionNumber: 1 });

        return success(
            res,
            'Get part by id success',
            {
                part,
                questions,
                questionCount: questions.length
            }
        );
    } catch (error) {
        return error(res, 'Get part by id error');
    }
};

// [POST] /api/test/:slug/parts
export const createPart = async (req, res) => {
    try {
        // validate input

        const { slug } = req.params;

        // Check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        // Check partNumber already exists for this test
        const existingPart = await Part.findOne({
            testId: test._id,
            partNumber: req.body.partNumber
        });

        if (existingPart) {
            return error(res, 'Part number already exists for this test');
        }

        // create Part
        const part = new Part({
            ...req.body,
            testId: test._id
        });

        await part.save();

        return success(res, 'Create part success', { part });
    } catch (err) {
        return error(res, 'error Create Test');
    }
};

// [PUT] /api/test/:slug/parts/:partId
export const updatePart = async (req, res) => {
    try {
        // validate input

        const { slug, partId } = req.params;

        // Check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        const updateData = { ...req.body };

        const part = await Part.findOneAndUpdate(
            { _id: partId, testId: test._id },
            updateData,
            { new: true, runValidators: true },
        ).populate('testId', 'title slug');

        if (!part) {
            return error(res, 'Part not found');
        }

        return success(res, 'Update part success', { part })
    } catch (error) {
        return error(res, 'Update part error');
    }
};

// [DELETE] /api/test/:slug/parts/:partId
export const deletePart = async (req, res) => {
    try {
        // hard delete - no casade with question
        // solution -> remove part and all question of this part

        const { slug, partId } = req.params;

        // Check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        // Delete part
        const part = await Part.findOneAndDelete({
            _id: partId,
            testId: test._id
        });

        if (!part) {
            return error(res, 'part not found');
        }

        // Casade: delete all questions of this part
        await Question.deleteMany({ partId: part._id });

        return success(res, 'Delete part success', { part });
    } catch (error) {
        return error(res, 'Delete part error');
    }
};
