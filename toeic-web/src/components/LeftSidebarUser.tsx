// LeftSidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";

interface LeftSidebarUserProps {
  customHeight?: string; // Cho phép truyền chiều cao tùy ý
}

const LeftSidebarUser: React.FC<LeftSidebarUserProps> = ({ customHeight }) => {
  return (
    <div
      className={`bg-gray-100 flex flex-col p-4 ${
        customHeight ? customHeight : "h-screen w-64 min-w-44"
      }`}
    >
      {/* Phần thông tin người dùng */}
      <div className="flex items-center mb-6">
        <img
          src="src/assets/images/ai-image.png"
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold">Khanh Huyen</h2>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">🇻🇳</span> Vietnam
          </p>
        </div>
      </div>

      {/* Phần menu */}
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link
              to="/history"
              className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded"
            >
              <FaHistory className="mr-3" />
              Lịch sử làm bài
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/settings"
              className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded"
            >
              <FaCog className="mr-3" />
              Cài đặt
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/logout"
              className="flex items-center p-2 text-red-500 hover:bg-blue-100 rounded"
            >
              <FaSignOutAlt className="mr-3" />
              Đăng xuất
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftSidebarUser;
