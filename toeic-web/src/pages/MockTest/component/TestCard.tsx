import React from "react";
import { BookOpen, Users, Timer, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestCardProps {
  slug: string; // prop to identify the toeic test
  title: string;
  questions: number;
  time: number; // time in minutes
  attempts: number;
  totalComments: number;
}

const TestCard: React.FC<TestCardProps> = ({
  slug,
  title,
  questions,
  time,
  attempts,
  totalComments,
}) => {
  const navigate = useNavigate(); // useNavigate hook to navigate between routes

  const handleViewDetail = () => {
    navigate(`/test/${slug}`, {
      state: { attempts },
    }); // Redirect to the mock-test page with the specific id
  };

  return (
    <div
      onClick={handleViewDetail}
      className="cursor-pointer border rounded-xl shadow-md p-5 bg-white w-80
                 hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-out
                 flex flex-col justify-between"
    >
      {/* Tiêu đề */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-4">
          {title}
        </h2>

        {/* Grid thông tin */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen size={16} /> <span>{questions} câu hỏi</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer size={16} /> <span>{time} phút</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} /> <span>{attempts} lượt làm</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{totalComments ?? 0} bình luận</span>
          </div>
        </div>
      </div>

      {/* Nút xem chi tiết */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetail();
        }}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default TestCard;
