import Test from "../models/Test.js";

export const getAllTest = (req, res) => {
    res.send('Tất cả đề thi');
};

export const getTestDetail = (req, res) => {
    res.send('Đây là trang chi tiết đề thi');
};

export const createTest = async (req, res, userId) => {
    try {
        
        const newTest = await Test.create({
            title: 'TOEIC test 1',
            testCode: 'T001',
            level: 'beginner',
            category: 'practice',
            createdBy: userId,
            metadata: { source: 'Custom' }
        });

        await newTest.save();

        res.status(200).json({ newTest });
    } catch (error) {
        console.error('Lỗi khi gọi Create Test', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const updateTest = (req, res) => {
    res.send('Edit đề thi');
};

export const deleteTest = (req, res) => {
    res.send('Xóa đề thi');
};
