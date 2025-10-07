import React from "react";
import QuestionItem from "./QuestionItem";

interface QuestionListProps {
  questionsInPart: any[];
  answers: (number | null)[];
  handleAnswer: (questionIndex: number, optionIndex: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questionsInPart,
  answers,
  handleAnswer,
}) => {
  return (
    <div className="w-full max-w-4xl">
      {questionsInPart.map((question, index) => (
        <QuestionItem
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
