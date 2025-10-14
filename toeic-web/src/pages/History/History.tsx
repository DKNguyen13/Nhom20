import React from "react";
import { FaRegClock } from "react-icons/fa";
import LeftSidebarUser from "../../components/LeftSidebarUser";
import HistoryTestCard from "../../components/HistoryTestCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ProgressCard from "./components/ProgressCard";
import { useSessionsUser } from "../MockTest/hooks/useTestSession";

// Đăng ký các thành phần cần thiết của ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryPage: React.FC = () => {
  const chartData = {
    labels: ["Test 01", "Test 02", "Test 03", "Test 04", "Test 05", "Test 06"],
    datasets: [
      {
        label: "Reading",
        data: [25, 30, 20, 50, 70, 80],
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        tension: 0.4,
      },
      {
        label: "Listening",
        data: [10, 20, 50, 60, 50, 40],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Tiến độ điểm số",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Điểm số",
        },
      },
      x: {
        title: {
          display: true,
          text: "Bài kiểm tra",
        },
      },
    },
  };

  const { sessions, error, loading, pagination, setPage } = useSessionsUser();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!sessions) return <p className="text-center">No result found</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Phần trên: LeftSidebar + Biểu đồ */}
      <div className="flex-1 flex pl-8 pr">
        {/* Left Sidebar */}
        <LeftSidebarUser customHeight="h-auto w-64" />

        {/* Khu vực Biểu đồ (Tổng quan) */}
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Lịch sử làm bài
          </h1>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-4">
            {/* Placeholder Biểu đồ */}
            <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-200 pr-4">
              <h2 className="text-xl font-semibold mb-2">Tổng quan</h2>
              <div className="w-full h-40 bg-blue-50 flex items-center justify-center text-blue-400">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="flex space-x-4 mt-3 text-sm"></div>
            </div>

            {/* Thông tin thống kê */}
            <div className="flex-1 flex flex-col items-center justify-center md:justify-around">
              <ProgressCard
                progress={32} // Tiến độ
                level="A1" // Cấp độ hiện tại
                totalTests={10} // Số bài thi đã thực hiện
                averageScore={75} // Điểm trung bình
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phần dưới: Danh sách bài test */}
      <div className="bg-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((item) => (
            <HistoryTestCard
              key={item._id}
              id={item._id}
              title={item.testId.title}
              totalScore={item?.results?.totalScore}
              result={item.progress.answeredCount}
              totalQuestions={item.progress.totalQuestions}
              accuracy={item?.results?.accuracy}
              time={item.time}
              createdAt={item.createdAt}
              sessionType={item.sessionType}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 space-x-2">
            {/* Prev */}
            <button
              disabled={pagination.current === 1}
              onClick={() => setPage(pagination.current - 1)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                pagination.current === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50 active:bg-blue-100"
              }`}
            >
              ← Prev
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: pagination.pages }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                      pagination.current === pageNumber
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              disabled={pagination.current === pagination.pages}
              onClick={() => setPage(pagination.current + 1)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                pagination.current === pagination.pages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50 active:bg-blue-100"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
