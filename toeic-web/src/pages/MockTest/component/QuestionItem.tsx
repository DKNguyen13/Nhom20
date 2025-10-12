import React from "react";

interface QuestionItemProps {
  isView: boolean;
  question: {
    _id: string;
    globalQuestionNumber: number;
    displayImage?: string;
    displayContent?: string;
    displayChoices: { _id: string; displayText: string }[];
    correctAnswer: number; // assume backend trả về index (0-based)
  };
  questionIndex: number;
  answers?: (number | null)[]; // cho phép undefined khi isView = true
  handleAnswer?: (questionIndex: number, optionIndex: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  isView,
  question,
  questionIndex,
  answers,
  handleAnswer,
}) => {
  // Lấy đáp án đã chọn của người dùng nếu có
  const selected =
    answers && answers.length >= question.globalQuestionNumber
      ? answers[question.globalQuestionNumber - 1]
      : null;

  const correctIndex = question.correctAnswer;

  /** Trả về class style phù hợp với trạng thái */
  const getButtonStyle = (optionIndex: number): string => {
    if (!isView) {
      // Khi đang làm bài
      return selected === optionIndex
        ? "bg-blue-500 text-white border-blue-600"
        : "hover:bg-gray-200 border-gray-300";
    }

    // Khi xem lại kết quả
    if (optionIndex === correctIndex) return "bg-green-500 text-white";
    if (selected === optionIndex && selected !== correctIndex)
      return "bg-red-500 text-white";
    return "bg-gray-100";
  };

  return (
    <div
      id={`question-${question.globalQuestionNumber}`}
      className="mb-4 border-b border-gray-200 pb-4"
    >
      {/* Hiển thị ảnh nếu có */}
      {question.displayImage && (
        <img
          src={question.displayImage}
          alt={`question-${question.globalQuestionNumber}`}
          className="mb-2 max-w-md w-full h-auto mx-auto rounded-lg"
        />
      )}

      {/* Nội dung câu hỏi */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm mt-1">
          {question.globalQuestionNumber}
        </div>
        {question.displayContent && (
          <div className="flex-1 pt-1">
            <p className="text-gray-800">{question.displayContent}</p>
          </div>
        )}
      </div>

      {/* Danh sách lựa chọn */}
      {question.displayChoices?.map((option, optionIndex) => (
        <button
          key={option._id}
          onClick={() => {
            if (!isView && handleAnswer) {
              handleAnswer(questionIndex, optionIndex);
            }
          }}
          className={`border p-2 rounded-md w-full text-left mb-2 transition-colors duration-150 ${getButtonStyle(
            optionIndex
          )}`}
        >
          {option.displayText}
        </button>
      ))}
    </div>
  );
};

export default QuestionItem;
