import React, { useRef, useState } from "react";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import { FaEllipsisH, FaTimes, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import { useEffect } from "react";
import { MoreHorizontal, Plus, HelpCircle, Edit2, Trash2 } from "lucide-react";

interface Test {
  title: string;
  slug: string;
  testCode: string;
  category: string;
  createdAt: Date;
  isActive: boolean;
  statistics: {
    totalAttempts: number;
    averageScore: number;
  };
}

// Dropdown Component
const ActionDropdown: React.FC<{ test: Test; onNavigate: (path: string) => void }> = ({ test, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case "add-part":
        onNavigate(`/admin/create-part?slug=${test.slug}`);
        break;
      case "add-questions":
        onNavigate(`/admin/create-questions?slug=${test.slug}`);
        break;
      case "edit":
        onNavigate(`/admin/edit-test/${test.slug}`);
        break;
      case "delete":
        if (confirm(`Bạn có chắc muốn xóa đề thi "${test.title}"?`)) {
          console.log("Delete test:", test.slug);
        }
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
          <button
            onClick={() => handleAction("add-part")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-left text-gray-700 hover:text-blue-600"
          >
            <Plus className="text-blue-600" size={16} />
            <span className="font-medium">Thêm Part mới</span>
          </button>

          <button
            onClick={() => handleAction("add-questions")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition text-left text-gray-700 hover:text-green-600"
          >
            <HelpCircle className="text-green-600" size={16} />
            <span className="font-medium">Thêm câu hỏi</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => handleAction("edit")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 transition text-left text-gray-700 hover:text-yellow-600"
          >
            <Edit2 className="text-yellow-600" size={16} />
            <span className="font-medium">Chỉnh sửa</span>
          </button>

          <button
            onClick={() => handleAction("delete")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-left text-gray-700 hover:text-red-600"
          >
            <Trash2 className="text-red-600" size={16} />
            <span className="font-medium">Xóa đề thi</span>
          </button>
        </div>
      )}
    </div>
  );
};

const TestManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestCode, setSelectedTestCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      const response = await api.get("/test");
      const tests = response.data.data.tests;
      const formattedTests = tests.map((test: Test) => ({
        ...test,
        formattedDate: new Date(test.createdAt).toLocaleDateString("vi-VN"),
      }));

      setTests(formattedTests || []);
    };
    fetchTests();
  }, []);

  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <LeftSidebarAdmin customHeight="h-auto w-64" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Đề thi</h1>
          <button
            onClick={() => handleNavigate("/admin/create-test")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl 
                     hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 
                     font-semibold flex items-center gap-2"
          >
            <Plus size={16} />
            Tạo đề thi mới
          </button>
        </div>

        {/* Bảng danh sách đề thi */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên đề thi</th>
                <th className="py-3 px-4 text-center">Lượt làm</th>
                <th className="py-3 px-4 text-center">Điểm trung bình</th>
                <th className="py-3 px-4 text-center">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {tests.map((test, index) => (
                <tr
                  key={test.testCode}
                  className={`border-b hover:bg-gray-100 transition ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="py-4 px-4">{test.testCode}</td>
                  <td className="py-4 px-4">{test.title}</td>
                  <td className="py-4 px-4 text-center">
                    {test.statistics.totalAttempts}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {test.statistics.averageScore}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {new Date(test.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-4 text-center relative">
                    <ActionDropdown test={test} onNavigate={handleNavigate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Câu Hỏi */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-3 right-3 text-red-600 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>

            <button className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">
              <FaUpload />
              Upload File
            </button>

            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Thêm đề thi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagementPage;
