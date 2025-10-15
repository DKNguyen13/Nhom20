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
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizDirection, setQuizDirection] = useState<"en2vi" | "vi2en">("en2vi");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [canQuiz, setCanQuiz] = useState(true);
  const [correctCard, setCorrectCard] = useState<Flashcard | null>(null);

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

  const generateQuiz = () => {
    if (flashcards.length < 4) {
      setCanQuiz(false); // không đủ dữ liệu
      return;
    }

    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    setCorrectCard(correct);

    const wrongOptions: string[] = [];
    for (let i = 1; i < shuffled.length && wrongOptions.length < 3; i++) {
      const value = quizDirection === "en2vi" ? shuffled[i].meaning : shuffled[i].word;
      const correctValue = quizDirection === "en2vi" ? correct.meaning : correct.word;
      if (value !== correctValue && !wrongOptions.includes(value)) {
        wrongOptions.push(value);
      }
    }

      if (wrongOptions.length < 3) {
        setCanQuiz(false);
        return;
      }

    const options = [quizDirection === "en2vi" ? correct.meaning : correct.word, ...wrongOptions];
    setQuizOptions(options.sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setCanQuiz(true);
  };

  const handleNextQuiz = () => {
    setQuizIndex(prev => (prev + 1) % flashcards.length);
    generateQuiz();
  };

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (!correctCard) return;

    const correct = quizDirection === "en2vi" ? correctCard.meaning : correctCard.word;

    if (option === correct) setScore(prev => prev + 1);
  };

  useEffect(() => {
    fetchFlashcards();
  }, [setId]);

  useEffect(() => {
    if (mode === "Ngẫu nhiên") setRandomIndex(0);
    if (mode === "Trắc nghiệm") generateQuiz();
  }, [mode, flashcards, quizDirection]);

  if (loading) return <p className="text-center mt-4">Đang tải...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      <h1 className="text-2xl font-bold text-center mb-10">📚 Flashcards</h1>

      <div className="flex items-center gap-2 mb-6 justify-center">
        <label htmlFor="mode" className="text-sm font-medium text-gray-700">Chế độ:</label>
        <select id="mode"
          value={mode} onChange={(e) => setMode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option value="Xem toàn bộ thẻ">📖 Xem toàn bộ thẻ</option>
          <option value="Ngẫu nhiên">🔁 Ngẫu nhiên</option>
          <option value="Trắc nghiệm">📝 Trắc nghiệm</option>
        </select>
        {mode === "Trắc nghiệm" && flashcards.length >= 4 && (
          <select value={quizDirection} onChange={(e) => setQuizDirection(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="en2vi">Anh → Việt</option>
            <option value="vi2en">Việt → Anh</option>
          </select>
        )}
      </div>

        {/* MODE TRẮC NGHIỆM */}
        {mode === "Trắc nghiệm" ? (
        canQuiz ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md p-6 border rounded-lg shadow-md text-center">
              <h2 className="text-lg mb-4 font-semibold">
                {quizDirection === "en2vi" ? correctCard?.word : correctCard?.meaning}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quizOptions.map(opt => (
                  <button key={opt} onClick={() => handleOptionClick(opt)}
                    className={`p-2 rounded border ${
                      selectedOption
                        ? opt === (quizDirection === "en2vi" ? correctCard?.meaning : correctCard?.word)
                          ? "bg-green-300 border-green-500"
                          : opt === selectedOption
                            ? "bg-red-300 border-red-500"
                            : "bg-white"
                        : "bg-white hover:bg-gray-100"
                    } transition`}>
                    {opt}
                  </button>
                ))}
              </div>
              {selectedOption && (
                <button onClick={handleNextQuiz} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Tiếp
                </button>
              )}
              <p className="mt-2 text-sm text-gray-600">Điểm: {score}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500">Chưa có đủ flashcards để chơi trắc nghiệm!</p>
        )
      ) : mode === "Ngẫu nhiên" && flashcards.length > 0 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md h-80">
            <FlashcardItem
              flashcard={flashcards[randomIndex]}
              onDelete={editable ? () => handleDelete(flashcards[randomIndex]._id!) : undefined}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <button onClick={prevCard} disabled={flashcards.length <= 1} className={`px-4 py-2 rounded ${flashcards.length > 1 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              ← Trước
            </button>
            <button onClick={nextCard} disabled={flashcards.length <= 1} className={`px-4 py-2 rounded ${flashcards.length > 1 ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Tiếp →
            </button>
          </div>
        </div>
      ) : (
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

            <input name="word" placeholder="Từ vựng" value={form.word}
              onChange={(e) => setForm({ ...form, word: e.target.value })}
              className="border p-2 w-full rounded-md mb-2" />
            <input name="meaning" placeholder="Nghĩa" value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              className="border p-2 w-full rounded-md mb-2" />
            <input name="example" placeholder="Ví dụ (tùy chọn)" value={form.example}
              onChange={(e) => setForm({ ...form, example: e.target.value })}
              className="border p-2 w-full rounded-md mb-2" />
            <input name="note" placeholder="Ghi chú (tùy chọn)" value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border p-2 w-full rounded-md mb-3" />

            <div className="flex justify-between items-center mt-4">
              <button onClick={handleAdd} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition">Thêm</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default FlashcardList;
