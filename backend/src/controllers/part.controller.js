import { success, fail } from '../helpers/responseHelper.js';

import Test from "../models/test.model.js";
import Part from "../models/part.model.js";
import Question from "../models/question.model.js";

// [GET] /api/test/:slug/parts
export const getAllParts = async (req, res) => {
    try {
        const { slug } = req.params;
        const test = await Test.findOne({ slug });

        if (!test) {
            return fail(res, 'Test not found');
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
        return success(res, {
            data: {
                test: { slug: test.slug, title: test.title },
                partWithCounts
            }
        });

    } catch (error) {
        return fail(res, 'Get all test fail', error.message);
    }
};

// [GET] /api/part/:id
export const getPartById = async (req, res) => {
    try {

        const { id } = req.params;

        const part = await Part.findById(id).populate('testId', 'title testCode');

        if (!part) {
            return fail(res, 'Part not found');
        }

        // Get questions for this part
        const questions = await Question.find({ partId: id })
            .sort({ questionNumber: 1 });

        return success(
            res,
            {
                part,
                questions,
                questionCount: questions.length
            }
        );
    } catch (error) {
        return fail(res, 'Get part by id fail', error.message);
    }
};

// [POST] /api/test/:/testId/part
export const createPart = async (req, res) => {
    try {
        // validate input

        const { testId } = req.params;

        // Check test exists
        const test = await Test.findById(testId);
        if (!test) {
            return fail(res, 'Test not found');
        }

        // Check partNumber already exists for this test
        const existingPart = await Part.findOne({
            testId,
            partNumber: req.body.partNumber
        });

        if (existingPart) {
            return fail(res, 'Part number already exists for this test');
        }

        // create Part
        const part = new Part({
            ...req.body,
            testId
        });

        await part.save();

        return success(res, { part });
    } catch (error) {
        return fail(res, 'Fail Create Test', error.message);
    }
};

// [PUT] /api/part/:id
export const updatePart = async (req, res) => {
    try {
        // validate input

        const { id } = req.params;
        const updateData = { ...req.body };

        const part = await Part.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true },
        ).populate('testId', 'title testCode');

        if (!part) {
            return fail(res, 'Part not found');
        }

        return success(res, { part })
    } catch (error) {
        return fail(res, 'Update part fail', error.message);
    }
};

// [DELETE] /api/part/:id
export const deletepart = async (req, res) => {
    try {
        // hard delete - no casade with question
        // solution -> remove part and all question of this part

        const { id } = req.params;
        const part = await Part.findByIdAndDelete(id);

        if (!part) {
            return fail(res, 'part not found');
        }

        return success(res, { part });
    } catch (error) {
        return fail(res, 'Delete part fail', error.message);
    }
};
