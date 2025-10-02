import React, { useRef } from "react";
import Navigation from "./component/Navigation";
import IcBreadcrumbGbk from "../../assets/icons/IcBreadcrumbGbk";
import { useTestSession } from "./hooks/useTestSession";

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
  } = useTestSession();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row justify-between flex-1 overflow-hidden">
        {/* Left: Questions */}
        <div className="flex-1 flex flex-col justify-start items-center p-4 overflow-auto">
          <div className="w-full flex items-center justify-between mb-5">
            {/* Return button */}
            <div
              className="inline-flex items-center gap-3 text-lg text-main font-normal cursor-pointer"
              onClick={handleGoBack}
            >
              <IcBreadcrumbGbk />
              <span>Return</span>
            </div>

            {/* Audio */}
            {session?.sessionType === "full-test" && session.testId.audio && (
              <div className="flex-1 flex justify-center">
                <audio
                  controls
                  className="w-full max-w-2xl rounded-full bg-gray-100"
                  src={session.testId.audio}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>

          {/* Part selection */}
          <div className="flex gap-2 my-4">
            {parts.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setCurrentPart(p);
                  setCurrentQuestion(0);
                }}
                className={`px-3 py-1 rounded-md ${
                  currentPart === p ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Part {p}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="w-full max-w-4xl">
            {questionsInPart.map((question, index) => (
              <div
                key={question._id}
                id={`question-${question.globalQuestionNumber}`}
                className="mb-4"
              >
                {/* Hình ảnh nếu có */}
                {question.displayImage && (
                  <img
                    src={question.displayImage}
                    alt=""
                    className="mb-2 max-w-md w-full h-auto mx-auto rounded-lg"
                  />
                )}

                <div className="flex items-start space-x-3 mb-4">
                  {/* Số câu hỏi được bao quanh bởi hình tròn */}
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm mt-1">
                    {question.globalQuestionNumber}
                  </div>

                  {/* Nội dung câu hỏi */}
                  {question.displayContent && (
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800">{question.displayContent}</p>
                    </div>
                  )}
                </div>

                {/* Các lựa chọn */}
                {question.displayChoices.map((option, optionIndex) => (
                  <button
                    key={option._id}
                    onClick={() => handleAnswer(index, optionIndex)}
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
            ))}
          </div>

          {/* Chuyển part */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextPart}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Tiếp theo
            </button>
          </div>
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
            onSubmit={() => {
              console.log("Redirect to result page");
            }}
          />
        </div>
      </div>
    </div>
  );
};
