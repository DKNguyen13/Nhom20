import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaQuestionCircle,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

interface LeftSidebarAdminProps {
  customHeight?: string; // Cho phép truyền chiều cao tùy ý
}

const LeftSidebarAdmin: React.FC<LeftSidebarAdminProps> = ({
  customHeight,
}) => {
  return (
    <div
      className={`bg-white flex flex-col p-4 ${
        customHeight ? customHeight : "h-screen w-64 min-w-44"
      }`}
    >
      {/* Phần thông tin người dùng */}
      <div className="flex items-center mb-6">
        <img
          src="./../src/assets/images/ai-image.png" // Thay ảnh avatar của Admin
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold">Socchuot</h2>
          <p className="text-sm text-gray-500 flex items-center">Admin</p>
        </div>
      </div>

      {/* Phần menu */}
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded"
            >
              <FaTachometerAlt className="mr-3" />
              Thống kê
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/usermanagement"
              className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded"
            >
              <FaUsers className="mr-3" />
              Người dùng
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/admin/testmanagement"
              className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded"
            >
              <FaFileAlt className="mr-3" />
              Đề thi
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

export default LeftSidebarAdmin;
