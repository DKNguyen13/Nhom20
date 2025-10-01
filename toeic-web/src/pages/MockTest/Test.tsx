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

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            {questionsInPart.map((question, index) => {
              // Lấy số part (giả sử có thể truy cập qua question.partNumber)
              const currentPartNumber = question.partNumber;
              // Kiểm tra xem part hiện tại có cần hiển thị ảnh và câu hỏi song song không
              const isImageSideBySide = [3, 4, 6, 7].includes(
                currentPartNumber
              );

              return (
                <div
                  key={question._id}
                  id={`question-${question.globalQuestionNumber}`}
                  className="mb-6" // Tăng khoảng cách dưới
                >
                  {/* Container cho Hình ảnh và Nội dung Câu hỏi (áp dụng flexbox nếu có ảnh) */}
                  <div
                    className={`flex ${
                      isImageSideBySide && question.displayImage
                        ? "flex-col md:flex-row md:space-x-6"
                        : "flex-col"
                    }`}
                  >
                    {/* 1. Khu vực Hình ảnh (luôn hiển thị nếu có, căn lề trái nếu side-by-side) */}
                    {isImageSideBySide && question.displayImage && (
                      <div className="md:w-1/2 flex-shrink-0 mb-4 md:mb-0">
                        <img
                          src={question.displayImage}
                          alt={`Graphic for Question ${question.globalQuestionNumber}`}
                          className="w-full h-auto mx-auto md:mx-0 rounded-lg shadow-md"
                        />
                      </div>
                    )}

                    {/* 2. Khu vực Số câu hỏi, Nội dung và Lựa chọn */}
                    <div
                      className={
                        isImageSideBySide && question.displayImage
                          ? "md:w-1/2"
                          : "w-full"
                      }
                    >
                      <div className="flex items-start space-x-3 mb-2">
                        {" "}
                        {/* Giảm mb để gần lựa chọn hơn */}
                        {/* Số câu hỏi được bao quanh bởi hình tròn */}
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm mt-1">
                          {question.globalQuestionNumber}
                        </div>
                        {/* Nội dung câu hỏi */}
                        {question.displayContent && (
                          <div className="flex-1 pt-1">
                            <p className="text-gray-800 font-semibold">
                              {question.displayContent}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Các lựa chọn (Bố cục giữ nguyên, chỉ nằm trong div cha mới) */}
                      <div className="ml-11">
                        {" "}
                        {/* Thêm margin-left để căn chỉnh với nội dung câu hỏi */}
                        {question.displayChoices.map((option, optionIndex) => (
                          <button
                            key={option._id}
                            onClick={() => handleAnswer(index, optionIndex)}
                            className={`border p-3 rounded-lg w-full text-left mb-2 transition duration-150 ease-in-out ${
                              answers[question.globalQuestionNumber - 1] ===
                              optionIndex
                                ? "bg-blue-500 text-white shadow-md"
                                : "hover:bg-gray-100 bg-white border-gray-300" // Cập nhật style hover/default
                            }`}
                          >
                            <span className="font-bold mr-2">
                              {option.label}.
                            </span>
                            {option.displayText}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
