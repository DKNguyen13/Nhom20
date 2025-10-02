import Test from "../models/test.model.js";
import Part from "../models/part.model.js";
import Question from "../models/question.model.js";
import { success, error } from '../utils/response.js';

// [GET] /api/test/:slug/questions
export const getAllQuestionByTest = async (req, res) => {
    try {
        const { slug } = req.params;

        // check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        // Get list part of test
        const parts = await Part.find({ testId: test._id }).sort({ partNumber: 1 });

        const questions = await Question.find({ testId: test._id })
            .sort({ partNumber: 1, questionNumber: 1 })
            .populate('partId', 'partNumber title');

        const totalQuestion = await Question.countDocuments({ testId: test._id });

        return success(
            res,
            'Get all question by test success',
            {
                test: { title: test.title, slug: test.slug },
                parts: parts.map(part => ({
                    id: part._id,
                    partNumber: part.partNumber,
                    title: part.title
                })),
                questions: {
                    items: questions,
                    total: totalQuestion,
                },
            }
        )

    } catch (error) {
        return error(res, 'Get all question by test error');
    }
};

// [GET] /api/test/:slug/parts/:partId/questions
export const getAllQuestionByPart = async (req, res) => {
    try {
        const { slug } = req.params;
        const { partIds } = req.query; // /api/test/:slug/parts/:partId/questions?partIds=123123,xxxxx

        // Check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        const partIdArray = partIds ? partIds.split(",") : [];

        const parts = await Part.find({
            _id: { $in: partIdArray },
            testId: test._id
        }).populate('testId', 'title testCode');

        // Check parts exists
        if (!parts || parts.length === 0) {
            return error(res, 'Parts not found');
        }

        // Build filter for parts
        const filter = { testId: test._id };
        if (partIdArray.length > 0) {
            filter.partId = { $in: partIdArray }
        }

        const questions = await Question.find(filter)
            .sort({ partNumber: 1, questionNumber: 1 });

        const totalQuestion = await Question.countDocuments(filter);

        return success(
            res,
            'Get all question by part success',
            {
                data: {
                    parts,
                    questions: {
                        items: questions,
                        total: totalQuestion,
                    }
                }
            });

    } catch (error) {
        return error(res, 'Get all question by parts error');
    }
};


// [POST] /api/test/:slug/parts/:partId/questions
export const createQuestions = async (req, res) => {
    try {
        // validate input

        const { slug, partId } = req.params;
        const questionsData = req.body.questions;

        // Check test exists
        const test = await Test.findOne({ slug });
        if (!test) {
            return error(res, 'Test not found');
        }

        // Check part exists
        const part = await Part.findOne({ _id: partId, testId: test._id });
        if (!part) {
            return error(res, 'Part not found in this test to create Question');
        }

        // Get last question number in part
        const lastQuestion = await Question.findOne({ partId })
            .sort({ questionNumber: -1 });
        let questionNumber = lastQuestion ? lastQuestion.questionNumber : 0;

        // Get global question count in test
        let globalQuestionNumber = await Question.countDocuments({ testId: test._id });

        // Question data to insert
        const questionsToInsert = questionsData.map(q => {
            questionNumber++;
            globalQuestionNumber++;
            return {
                ...q,
                partId,
                testId: part.testId,
                partNumber: part.partNumber,
                questionNumber,
                globalQuestionNumber,
            }
        })

        const insertedQuestions = await Question.insertMany(questionsToInsert);

        // update total question for part
        await Part.findByIdAndUpdate(partId, {
            $inc: { totalQuestion: questionsToInsert.length }
        });

        return success(
            res,
            'create Questions success',
            {
                questions: insertedQuestions,
            }
        );
    } catch (error) {
        return error(res, 'error Create question');
    }
};

