import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import FlashcardItem from "./FlashcardItem";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

export interface Flashcard {
  _id?: string;
  word: string;
  meaning: string;
  example?: string;
  note?: string;
}

interface FlashcardListProps {
  setId?: string;
  type?: "myList" | "explore";
}

const FlashcardList: React.FC<FlashcardListProps> = ({ setId, type: propType }) => {
  const location = useLocation();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ word: "", meaning: "", example: "", note: "" });
  const [mode, setMode] = useState("Xem toàn bộ thẻ");
  const [randomIndex, setRandomIndex] = useState(0);

  const type = propType || location.state?.type || "myList";
  const editable = type === "myList";

  const fetchFlashcards = async () => {
    if (!setId) return;
    try {
      setLoading(true);
      const url = type === "explore" ? "/flashcard/free" : "/flashcard";
      const res = await api.get(url, { params: { set: setId } });
      setFlashcards(res.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tải flashcard!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.word || !form.meaning) {
      toast.warn("Nhập đầy đủ từ và nghĩa!");
      return;
    }
    if (!setId) return;

    try {
      const res = await api.post("/flashcard", { ...form, set: setId });
      setFlashcards((prev) => [...prev, res.data.data]);
      setShowModal(false);
      setForm({ word: "", meaning: "", example: "", note: "" });
      toast.success("Thêm flashcard thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo flashcard!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/flashcard/${id}`);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      toast.success("Đã xóa flashcard thành công!");
      // Nếu xóa card hiện tại, reset randomIndex
      if (randomIndex >= flashcards.length - 1) setRandomIndex(0);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa flashcard!");
    }
  };

  const nextCard = () => {
    setRandomIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setRandomIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  useEffect(() => {
    fetchFlashcards();
  }, [setId]);

  // Reset card ngẫu nhiên khi đổi mode
  useEffect(() => {
    if (mode === "Ngẫu nhiên") setRandomIndex(0);
  }, [mode]);

  if (loading) return <p className="text-center mt-4">Đang tải...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      {/* Thanh chọn chế độ */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <label htmlFor="mode" className="text-sm font-medium text-gray-700">
          Chế độ:
        </label>
        <select id="mode"
          value={mode} onChange={(e) => setMode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option value="Xem toàn bộ thẻ">📖 Xem toàn bộ thẻ</option>
          <option value="Ngẫu nhiên">🔁 Ngẫu nhiên</option>
          <option value="Trắc nghiệm">📝 Trắc nghiệm</option>
        </select>
      </div>

      <h1 className="text-2xl font-bold text-center mb-10">📚 Flashcards ({mode})</h1>

      {/* Chế độ Ngẫu nhiên ngẫu nhiên */}
      {mode === "Ngẫu nhiên" && flashcards.length > 0 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md h-80">
            <FlashcardItem
              flashcard={flashcards[randomIndex]}
              onDelete={editable ? () => handleDelete(flashcards[randomIndex]._id!) : undefined}
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button onClick={prevCard}
              disabled={flashcards.length <= 1}
              className={`px-4 py-2 rounded ${flashcards.length > 1 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              ← Trước
            </button>
            <button onClick={nextCard}
              disabled={flashcards.length <= 1}
              className={`px-4 py-2 rounded ${flashcards.length > 1 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Tiếp →
            </button>
          </div>
        </div>
      ) : (
        // Grid mnode
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {editable && (
            <div onClick={() => setShowModal(true)}
              className="border-2 border-dashed border-blue-400 rounded-xl flex justify-center items-center h-48 text-blue-500 hover:bg-blue-50 cursor-pointer transition">
              <span className="text-5xl font-bold">+</span>
            </div>
          )}

          {flashcards.length > 0 ? (
            flashcards.map((card) => (
              <FlashcardItem
                key={card._id}
                flashcard={card}
                onDelete={editable ? handleDelete : undefined}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center py-16 text-gray-500">
              <p className="text-lg font-medium mb-2">
                📭 {editable ? "Hiện tại bạn chưa có flashcard nào" : "Chưa có flashcard trong set này"}
              </p>
              {editable && <p className="text-sm">Nhấn dấu + để tạo flashcard đầu tiên!</p>}
            </div>
          )}
        </div>
      )}

      {/* Modal tạo flashcard */}
      {editable && showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg scale-95 animate-[fadeIn_0.2s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-center mb-4">✨ Tạo Flashcard Mới</h2>

            <input
              name="word"
              placeholder="Từ vựng"
              value={form.word}
              onChange={(e) => setForm({ ...form, word: e.target.value })}
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              name="meaning"
              placeholder="Nghĩa"
              value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              name="example"
              placeholder="Ví dụ (tùy chọn)"
              value={form.example}
              onChange={(e) => setForm({ ...form, example: e.target.value })}
              className="border p-2 w-full rounded-md mb-2"
            />
            <input
              name="note"
              placeholder="Ghi chú (tùy chọn)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border p-2 w-full rounded-md mb-3"
            />

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleAdd}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition"
              >
                Thêm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default FlashcardList;
