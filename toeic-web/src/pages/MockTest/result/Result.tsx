import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  type TooltipItem,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Đăng ký các phần tử của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

type ResultProps = {
  id: string;
  testTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  isFullTest: boolean;
};

const Result: React.FC<ResultProps> = ({
  id,
  testTitle,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  skippedQuestions,
  listeningScore,
  readingScore,
  totalScore,
  isFullTest,
}) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(`/session/view/${id}`);
  };
  const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  const wrongPercentage = ((wrongAnswers / totalQuestions) * 100).toFixed(1);
  const skippedPercentage = ((skippedQuestions / totalQuestions) * 100).toFixed(1);

  // Dữ liệu cho biểu đồ hình tròn
  const data = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [
      {
        data: [correctPercentage, wrongPercentage, skippedPercentage],
        backgroundColor: ["#4CAF50", "#F44336", "#BDBDBD"],
        hoverBackgroundColor: ["#45a049", "#e53935", "#9E9E9E"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<'pie'>) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value}%`;
        },
      },
    },
    legend: {
      position: "bottom" as const,
    },
  },
};

  return (
    <div className="max-w-4xl min-w-[700px] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-3xl font-bold text-blue-700 mb-4">
        {testTitle}
      </h2>

      {isFullTest && (
        <div className="text-center mb-8">
          <div className="text-7xl text-yellow-500 mb-8">🏆</div>
          <h1 className="text-4xl font-bold text-gray-800">{`Your Score: ${
            totalScore ?? 0
          }/990`}</h1>
          <p className="mt-2 text-lg text-gray-500">
            Đây là trình độ ước tính của bạn. Để cải thiện điểm số, bạn có thể
            tìm hiểu các tài nguyên học tập của trang web.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng số câu hỏi:</span>
          <span className="font-semibold text-gray-800">{totalQuestions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu bỏ qua:</span>
          <span className="font-semibold text-gray-400">
            {skippedQuestions}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu đúng:</span>
          <span className="font-semibold text-green-600">{correctAnswers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số câu sai:</span>
          <span className="font-semibold text-red-500">{wrongAnswers}</span>
        </div>
      </div>

      {isFullTest && (
        <div className="grid grid-cols-2 text-center mb-16">
          <div>
            <p className="text-gray-600">Listening</p>
            <p className="text-2xl font-semibold text-gray-800">
              {listeningScore}/495
            </p>
          </div>
          <div>
            <p className="text-gray-600">Reading</p>
            <p className="text-2xl font-semibold text-gray-800">
              {readingScore}/495
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <h3 className="text-xl text-gray-700">Thống kê bài làm</h3>
          <div className="mt-4">
            <Pie data={data} options={options} />
          </div>
        </div>
      </div>

      <div className="text-center">
        {/* <p className="text-lg text-blue-500">
          Bạn cần cải thiện Phần 3 - Hội thoại ngắn
        </p> */}
        <div className="space-x-9">
          <button
            onClick={handleGoBack}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Xem lại bài làm
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
          >
            Bảng xếp hạng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;