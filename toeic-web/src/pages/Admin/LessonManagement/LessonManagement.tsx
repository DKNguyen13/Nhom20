import React, { useEffect, useState, useCallback } from "react";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import { FaEllipsisH, FaTimes, FaUpload } from "react-icons/fa";
import { createPortal } from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/axios";
import 'react-toastify/dist/ReactToastify.css';

interface Lesson {
  _id: string;
  title: string;
  type: "reading" | "vocabulary";
  accessLevel: "free" | "basic" | "advanced" | "premium";
  views: number;
  favoriteCount: number;
  isFavorite: boolean;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const LessonManagementPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuState, setMenuState] = useState<{ lessonId: string; coords: DOMRect } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get("/lessons");
        setLessons(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải bài học!");
      }
    };
    fetchLessons();
  }, []);

  // Delete lesson
  const handleDelete = async (id: string) => {
    try {
      await api.patch(`/lessons/${id}/delete`);
      setLessons((prev) => prev.filter((l) => l._id !== id));
      toast.success("Xóa bài học thành công!");
      closeMenu();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      toast.error("Xóa bài học thất bại!");
    }
  };

  const openMenu = (lessonId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuState({ lessonId, coords: rect });
  };

  const closeMenu = useCallback(() => setMenuState(null), []);

  // Click outside để đóng menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuState) return;
      const target = e.target as HTMLElement;
      if (!document.getElementById(`menu-${menuState.lessonId}`)?.contains(target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuState, closeMenu]);

  const totalPages = Math.ceil(lessons.length / ITEMS_PER_PAGE);
  const paginatedLessons = lessons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <LeftSidebarAdmin customHeight="h-auto w-64" />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý bài học</h1>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Thêm bài học mới
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">STT</th>
                <th className="py-3 px-4 text-left">Tiêu đề</th>
                <th className="py-3 px-4 text-left">Loại</th>
                <th className="py-3 px-4 text-left">Quyền</th>
                <th className="py-3 px-4 text-center">Views</th>
                <th className="py-3 px-4 text-center">Thích</th>
                <th className="py-3 px-4 text-center">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {paginatedLessons.map((lesson, index) => (
                <tr
                  key={lesson._id}
                  className={`border-b hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="py-4 px-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td className="py-4 px-4">{lesson.title}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        lesson.type === "reading" ? "bg-blue-200 text-blue-800" : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {lesson.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">{lesson.accessLevel}</td>
                  <td className="py-4 px-4 text-center">{lesson.views}</td>
                  <td className="py-4 px-4 text-center">{lesson.favoriteCount}</td>
                  <td className="py-4 px-4 text-center">{new Date(lesson.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-center relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 transition"
                      onClick={(e) => openMenu(lesson._id, e)}
                    >
                      <FaEllipsisH size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === page ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Dropdown menu via portal */}
        {menuState &&
          createPortal(
            <div
              id={`menu-${menuState.lessonId}`}
              style={{ position: "fixed", top: menuState.coords.bottom + 4, left: menuState.coords.left, width: 140, zIndex: 1000 }}
              className="bg-white border rounded shadow-lg"
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => toast.info("Tính năng sửa đang cập nhật")}
              >
                Sửa
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={() => setDeleteConfirmId(menuState.lessonId)}
              >
                Xóa
              </button>
            </div>,
            document.body
          )}

        {/* Modal Thêm bài học */}
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
                Upload File HTML
              </button>
              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Thêm bài học
              </button>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
              <p className="mb-6">Bạn có chắc muốn xóa bài học này?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={1000} />
      </div>
    </div>
  );
};

export default LessonManagementPage;
