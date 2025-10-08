import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface FlashcardSet {
  _id?: string;
  user?: string;
  name: string;
  description?: string;
  count?: number;
}

interface FlashcardSetListProps {
  type?: "myList" | "explore";
  isLoggedIn?: boolean;
}

const FlashcardSetList: React.FC<FlashcardSetListProps> = ({
  type = "myList",
  isLoggedIn = false,
}) => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const fetchSets = async () => {
    if (type === "myList" && !isLoggedIn) return;
    try {
      setLoading(true);
      const res =
        type === "myList"
          ? await api.get("/flashcard-set")
          : await api.get("/flashcard-set/free");
      setSets(res.data.data as FlashcardSet[]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tải bộ flashcard!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!form.name) {
      toast.warn("Nhập tên bộ flashcard!");
      return;
    }
    try {
      const res = await api.post("/flashcard-set", form);
      setSets((prev) => [...prev, res.data.data]);
      setShowModal(false);
      setForm({ name: "", description: "" });
      toast.success("Thêm bộ flashcard thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo bộ flashcard!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/flashcard-set/${id}`);
      setSets((prev) => prev.filter((s) => s._id !== id));
      toast.success("Đã xóa bộ flashcard thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa bộ flashcard!");
    }
  };

  const handleSetClick = (setId?: string) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/flashcards/${setId}`, { state: { type } });
    }
  };

  useEffect(() => {
    fetchSets();
  }, [isLoggedIn, type]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {type === "myList" ? "Bộ từ vựng Của Bạn" : "Khám phá Flashcards"}
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Add Button */}
          {type === "myList" && (
            <div onClick={() => setShowModal(true)}
              className="border-2 border-dashed border-blue-500 rounded-lg flex flex-col justify-center items-center h-48 bg-white hover:bg-blue-50 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md">
              <span className="text-4xl font-bold text-blue-500">+</span>
              <p className="text-sm font-medium text-blue-600 mt-2">
                Thêm bộ mới
              </p>
            </div>
          )}

          {/* Flashcard Sets */}
          {sets.length > 0 ? (
            sets.map((set) => (
              <div key={set._id}
                onClick={() => handleSetClick(set._id)}
                className="relative bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-300 h-48 flex flex-col justify-between cursor-pointer">
                <div className="overflow-hidden">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {set.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {set.description || "Không có mô tả"}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    Số flashcard: {set.count || 0}
                  </p>
                  {type === "myList" && isLoggedIn && (
                    <button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(set._id!);
                      }}
                      className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors">
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium mb-2">
                {type === "myList"
                  ? "Chưa có bộ từ vựng nào"
                  : "Hiện chưa có flashcards miễn phí"}
              </p>
              <p className="text-sm text-center">
                {type === "myList"
                  ? "Nhấn dấu + để tạo bộ từ vựng đầu tiên của bạn!"
                  : ""}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {type === "myList" && showModal && isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Tạo Bộ Flashcard Mới
            </h2>
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Tên bộ flashcard"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <textarea
                name="description"
                placeholder="Mô tả (tùy chọn)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none h-24"
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button onClick={handleAdd}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Thêm
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default FlashcardSetList;
