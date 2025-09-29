import React from "react";
import { BookOpen, Users, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestCardProps {
  slug: string; // prop to identify the toeic test
  title: string;
  questions: number;
  time: number; // time in minutes
  attempts: number;
}

const TestCard: React.FC<TestCardProps> = ({
  slug,
  title,
  questions,
  time,
  attempts,
}) => {
  const navigate = useNavigate(); // useNavigate hook to navigate between routes

  const handleViewDetail = () => {
    navigate(`/test/${slug}`); // Redirect to the mock-test page with the specific id
  };

  return (
    <div
      onClick={handleViewDetail} // click toàn bộ card
      className="cursor-pointer border rounded-xl shadow-md p-4 bg-white w-80 
                 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-out
                 flex flex-col justify-between"
    >
      <div>
        {/* Tiêu đề */}
        <h2 className="text-lg font-semibold mt-3">{title}</h2>

        {/* Thông tin questions & attempts */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mt-4">
          <div className="flex items-center gap-1">
            <BookOpen size={16} /> <span>Số câu hỏi: {questions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer size={16} className="ml-3" />{" "}
            <span>Thời gian: {time} phút</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
          <Users size={16} />{" "}
          <span className="font-medium">Số lượt làm: {attempts}</span>
        </div>
      </div>
      <button
        onClick={handleViewDetail} // vẫn xử lý click nút riêng
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default TestCard;
