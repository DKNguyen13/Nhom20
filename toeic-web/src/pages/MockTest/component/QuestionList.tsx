import React from "react";
import QuestionItem from "./QuestionItem";

interface QuestionListProps {
  isView: boolean;
  questionsInPart: any[];
  answers: (number | null)[];
  handleAnswer?: (questionIndex: number, optionIndex: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questionsInPart,
  answers,
  handleAnswer,
  isView
}) => {
  return (
    <div className="w-full max-w-4xl">
      {questionsInPart.map((question, index) => (
        <QuestionItem
          isView={isView}
          key={question._id}
          question={question}
          questionIndex={index}
          answers={answers}
          handleAnswer={handleAnswer}
        />
      ))}
    </div>
  );
};

export default QuestionList;
