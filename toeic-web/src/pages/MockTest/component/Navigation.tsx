import React, { useState, useEffect } from "react";
import { Choice, Question } from "../interface/interfaces"; // import interface

interface NavigationProps {
  isView: boolean;
  questions: Question[];
  currentPart: number;
  currentQuestion: number;
  answers: (number | null)[];
  onNavigate: (indexInPart: number) => void;
  onSubmit?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isView,
  questions,
  currentPart,
  currentQuestion,
  answers,
  onNavigate,
  onSubmit,
}) => {
  const [time, setTime] = useState(7200);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [time]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  // Lọc câu hỏi trong part hiện tại
  const questionsInPart = questions.filter((q) => q.partNumber === currentPart);

  const renderQuestionButtons = () =>
    questionsInPart.map((q, idx) => {
      const answered = answers[q.globalQuestionNumber - 1] != null;
      return (
        <button
          key={q._id}
          onClick={() => onNavigate(idx)}
          className={`border rounded-md text-center text-sm transition-all duration-200 p-1 ${
            currentQuestion === idx
              ? "bg-blue-500 text-white"
              : answered
              ? "bg-green-500 text-white"
              : "hover:bg-blue-500 hover:text-white"
          }`}
        >
          {q.globalQuestionNumber}
        </button>
      );
    });

  return (
    <div className="max-w-xs mx-auto p-4 bg-white h-full bottom-5 w-44">
      <div className="space-y-4">
        {!isView && (
          <div className="flex justify-between mb-4">
            <span className="text-sm">Thời gian còn lại:</span>
            <span className="font-semibold text-xl">
              {time > 0 ? formatTime(time) : "Hết giờ"}
            </span>
          </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleFullScreen}
            className="text-sm text-blue-500 hover:underline"
          >
            {isFullScreen ? "Thoát toàn màn hình" : "Chế độ toàn màn hình"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">{renderQuestionButtons()}</div>

        {onSubmit && (
          <div className="mt-4 text-center">
            <button
              onClick={onSubmit}
              className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
            >
              Nộp bài
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
