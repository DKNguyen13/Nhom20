import Test from "../models/Test.js";

// [GET] /api/test
export const getAllTest = async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [GET] /api/test/detail/:slug
export const getTestDetail = async (req, res) => {
    try {
        const test = await Test.findOne({ slug: req.params.slug });

        if (!test) {
            return res.status(500).json({ message: 'Test not found' });
        }

        return res.status(200).json({ test })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// [POST] /api/test/create
export const createTest = async (req, res, userId) => {
    try {

        const test = new Test(req.body);

        await test.save();

        res.status(200).json({ test });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTest = (req, res) => {
    res.send('Edit đề thi');
};

export const deleteTest = (req, res) => {
    res.send('Xóa đề thi');
};
