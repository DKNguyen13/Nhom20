import React from "react";
import Navigation from "./component/Navigation";
import { useTestSession } from "./hooks/useTestSession";
import TestHeader from "./component/TestHeader";
import PartSelector from "./component/PartSelector";
import QuestionList from "./component/QuestionList";
import { useParams } from "react-router-dom";
import { useViewSession } from "./hooks/useViewTestSession";

interface TestProps {
  isView: boolean; // true: review detail result
}

export const Test: React.FC<TestProps> = ({ isView }) => {
  // const {
  //   session,
  //   questions,
  //   answers,
  //   currentPart,
  //   currentQuestion,
  //   parts,
  //   questionsInPart,
  //   handleAnswer,
  //   handleNextPart,
  //   handleNavigateQuestion,
  //   handleGoBack,
  //   setCurrentPart,
  //   setCurrentQuestion,
  //   handleSubmitSession,
  // } = useTestSession();


  // 🔹 Chọn hook phù hợp theo chế độ hiển thị
  const hookData = isView
    ? useViewSession()
    : useTestSession();

  const {
    session,
    parts,
    currentPart,
    setCurrentPart,
    currentQuestion,
    setCurrentQuestion,
    questionsInPart,
    handleNavigateQuestion,
    handleGoBack,
    loading,
    // Các hàm chỉ có trong useTestSession
    handleAnswer,
    handleNextPart,
    handleSubmitSession,
    answers,
  } = hookData as ReturnType<typeof useTestSession> &
    ReturnType<typeof useViewSession>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

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
            handleAnswer={!isView ? handleAnswer : undefined}
            isView={isView}
          />

          {
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextPart}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Tiếp theo
              </button>
            </div>
          }
        </div>

        {/* Right: Navigation */}
        <div className="p-4 bg-white h-full w-fit overflow-y-scroll">
          <Navigation
            isView={isView}
            questions={questionsInPart}
            currentPart={currentPart}
            currentQuestion={currentQuestion}
            answers={answers}
            onNavigate={handleNavigateQuestion}
            onSubmit={!isView ? handleSubmitSession : undefined}
          />
        </div>
      </div>
    </div>
  );
};
