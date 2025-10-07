import React from "react";

interface QuestionItemProps {
  question: any;
  questionIndex: number;
  answers: (number | null)[];
  handleAnswer: (questionIndex: number, optionIndex: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  questionIndex,
  answers,
  handleAnswer,
}) => {
  return (
    <div
      id={`question-${question.globalQuestionNumber}`}
      className="mb-4 border-b border-gray-200 pb-4"
    >
      {/* Hình ảnh nếu có */}
      {question.displayImage && (
        <img
          src={question.displayImage}
          alt="question"
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

      {/* Các lựa chọn */}
      {question.displayChoices.map((option: any, optionIndex: number) => (
        <button
          key={option._id}
          onClick={() => handleAnswer(questionIndex, optionIndex)}
          className={`border p-2 rounded-md w-full text-left mb-2 ${
            answers[question.globalQuestionNumber - 1] === optionIndex
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {option.displayText}
        </button>
      ))}
    </div>
  );
};

export default QuestionItem;
