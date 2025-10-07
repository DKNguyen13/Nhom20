import React from "react";
import Navigation from "./component/Navigation";
import { useTestSession } from "./hooks/useTestSession";
import TestHeader from "./component/TestHeader";
import PartSelector from "./component/PartSelector";
import QuestionList from "./component/QuestionList";

interface TestProps {
  isView: boolean;
}

export const Test: React.FC<TestProps> = ({ isView = false }) => {
  const {
    session,
    questions,
    answers,
    currentPart,
    currentQuestion,
    parts,
    questionsInPart,
    handleAnswer,
    handleNextPart,
    handleNavigateQuestion,
    handleGoBack,
    setCurrentPart,
    setCurrentQuestion,
    handleSubmitSession,
  } = useTestSession();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-between flex-1 overflow-hidden">
        {/* Left: Main content */}
        <div className="flex-1 flex flex-col justify-start items-center p-4 overflow-auto">
          <TestHeader
            session={session}
            onGoBack={handleGoBack}
            isView={isView}
          />

          <PartSelector
            parts={parts}
            currentPart={currentPart}
            setCurrentPart={setCurrentPart}
            setCurrentQuestion={setCurrentQuestion}
          />

          <QuestionList
            questionsInPart={questionsInPart}
            answers={answers}
            handleAnswer={handleAnswer}
          />

          {!isView && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextPart}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Tiếp theo
              </button>
            </div>
          )}
        </div>

        {/* Right: Navigation */}
        <div className="p-4 bg-white h-full w-fit overflow-y-scroll">
          <Navigation
            isView={isView}
            questions={questions}
            currentPart={currentPart}
            currentQuestion={currentQuestion}
            answers={answers}
            onNavigate={handleNavigateQuestion}
            onSubmit={handleSubmitSession}
          />
        </div>
      </div>
    </div>
  );
};
