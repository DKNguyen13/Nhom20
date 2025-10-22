import React, { useState } from "react";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import { FaEllipsisH, FaTimes, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllTest } from "../../../service/testService";
import Pagination from "../../../components/common/Pagination/Pagination";

interface Test {
  title: string;
  testCode: string;
  category: string;
  createdAt: Date;
  isActive: boolean;
  statistics: {
    totalAttempts: number;
    averageScore: number;
  };
  limit?: number; // Giới hạn số test mỗi trang
  showPagination?: boolean; // Ẩn/hiện phân trang
}

const TestManagementPage: React.FC<Test> = ({
  limit = 10,
  showPagination = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTests, setTotalTests] = useState<number>(0);

  useEffect(() => {
    const fetchTests = async () => {
      const response = await getAllTest(currentPage, 10);
      const tests = response.tests;
      setTotalTests(response.pagination?.totalTests || 0);

      setTests(tests || []);
    };
    fetchTests();
  }, [currentPage]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <LeftSidebarAdmin customHeight="h-auto w-64" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Đề thi</h1>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/admin/create-test")}
          >
            Thêm đề thi mới
          </button>
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            onClick={() => navigate("/admin/create-part")}
          >
            Thêm Part mới
          </button>
          <button
            className="bg-orange-600 text-white px-3 py-3 rounded-md hover:bg-orange-700 transition"
            onClick={() => navigate("/admin/create-questions")}
          >
            Thêm dannh sách câu hỏi mới
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
                  <td className="py-4 px-4 text-center">
                    <button className="text-gray-500 hover:text-gray-700 transition">
                      <FaEllipsisH size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showPagination && totalTests > limit && (
            <Pagination
              totalItems={totalTests}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={limit}
            />
          )}
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
