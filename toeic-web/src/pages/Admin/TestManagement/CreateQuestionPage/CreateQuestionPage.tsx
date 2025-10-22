import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import axios from "axios";
import { getAllParts } from "../../../../service/partService";

interface Test {
  slug: string;
  title: string;
}

interface Part {
  _id: string;
  title: string;
  partNumber: number;
}

interface Choice {
  label: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
}

interface Question {
  title: string;
  partNumber: number;
  questionNumber: number;
  globalQuestionNumber: number;
  group: {
    text?: string;
    image?: File | null;
    audio?: File | null;
  };
  question: string;
  choices: Choice[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation?: string;
}

export default function CreateQuestionPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedTestSlug, setSelectedTestSlug] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      title: "",
      partNumber: 1,
      questionNumber: 1,
      globalQuestionNumber: 1,
      group: { text: "", image: null, audio: null },
      question: "",
      choices: [
        { label: "A", text: "", isCorrect: false },
        { label: "B", text: "", isCorrect: false },
        { label: "C", text: "", isCorrect: false },
        { label: "D", text: "", isCorrect: false },
      ],
      correctAnswer: "A",
      explanation: "",
    },
  ]);

  //🔹 Load danh sách đề thi
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get("/test");
        setTests(res.data.data?.tests || []);
      } catch (err) {
        console.error("Lỗi tải danh sách đề thi:", err);
      }
    };
    fetchTests();
  }, []);

  // 🔹 Khi chọn đề thi => load part
  useEffect(() => {
    if (selectedTestSlug) {
      const fetchParts = async () => {
        try {
          const data = await getAllParts(selectedTestSlug);
          setParts(data?.partWithCounts || []);
        } catch (err: any) {
          console.error("Lỗi tải danh sách part:", err.message);
          setParts([]);
        }
      };
      fetchParts();
    }
  }, [selectedTestSlug]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        partNumber: 1,
        questionNumber: questions.length + 1,
        globalQuestionNumber: questions.length + 1,
        group: { text: "", image: null, audio: null },
        question: "",
        choices: [
          { label: "A", text: "", isCorrect: false },
          { label: "B", text: "", isCorrect: false },
          { label: "C", text: "", isCorrect: false },
          { label: "D", text: "", isCorrect: false },
        ],
        correctAnswer: "A",
        explanation: "",
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    field: keyof Choice,
    value: any
  ) => {
    const updated = [...questions];
    (updated[qIndex].choices[cIndex] as any)[field] = value;
    setQuestions(updated);
  };

  const handleFileChange = (
    qIndex: number,
    field: "image" | "audio",
    file: File | null
  ) => {
    const updated = [...questions];
    updated[qIndex].group[field] = file;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTestSlug || !selectedPartId) {
      alert("Vui lòng chọn đề thi và part!");
      return;
    }
    const formData = new FormData();
    formData.append("questions", JSON.stringify(questions));
    formData.append("slug", selectedTestSlug);
    formData.append("partId", selectedPartId);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log("question: ", q);
    }
    questions.forEach((q, index) => {
      if (q.group?.image) formData.append(`image_${index}`, q.group.image);
      if (q.group?.audio) formData.append(`audio_${index}`, q.group.audio);
    });

    try {
      const res = await api.post(`/question`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Tạo câu hỏi thành công!");
      console.log(res);
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi khi tạo câu hỏi!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          📝 Tạo danh sách câu hỏi
        </h1>

        {/* Dropdown chọn Test & Part */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn đề thi
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedTestSlug}
              onChange={(e) => setSelectedTestSlug(e.target.value)}
            >
              <option value="">-- Chọn test --</option>
              {tests.map((test) => (
                <option key={test.slug} value={test.slug}>
                  {test.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Part
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
            >
              <option value="">-- Chọn part --</option>
              {parts.map((part) => (
                <option key={part._id} value={part._id}>
                  {part.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border border-blue-200 rounded-2xl p-6 shadow-sm bg-blue-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-blue-700">
                  Câu hỏi #{i + 1}
                </h2>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(i)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  className="border rounded-lg p-2"
                  value={q.title}
                  onChange={(e) =>
                    handleInputChange(i, "title", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Số câu hỏi"
                  className="border rounded-lg p-2"
                  value={q.questionNumber}
                  onChange={(e) =>
                    handleInputChange(i, "questionNumber", +e.target.value)
                  }
                />
              </div>

              <textarea
                placeholder="Nội dung câu hỏi"
                className="w-full border rounded-lg p-2 mt-4"
                value={q.question}
                onChange={(e) =>
                  handleInputChange(i, "question", e.target.value)
                }
              />

              {/* Image & Audio Upload */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600">Ảnh minh họa</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block mt-1"
                    onChange={(e) =>
                      handleFileChange(i, "image", e.target.files?.[0] || null)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Âm thanh</label>
                  <input
                    type="file"
                    accept="audio/*"
                    className="block mt-1"
                    onChange={(e) =>
                      handleFileChange(i, "audio", e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>

              {/* Choices */}
              <div className="mt-6 space-y-2">
                <label className="font-semibold text-blue-700">
                  Các lựa chọn:
                </label>
                {q.choices.map((c, ci) => (
                  <div
                    key={ci}
                    className="flex items-center gap-2 bg-white rounded-lg p-2"
                  >
                    <span className="font-bold">{c.label}.</span>
                    <input
                      type="text"
                      className="flex-1 border rounded-lg p-1"
                      placeholder={`Nội dung đáp án ${c.label}`}
                      value={c.text}
                      onChange={(e) =>
                        handleChoiceChange(i, ci, "text", e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name={`correct-${i}`}
                      checked={q.correctAnswer === c.label}
                      onChange={() =>
                        handleInputChange(i, "correctAnswer", c.label)
                      }
                    />
                    <span className="text-sm text-gray-500">Đúng</span>
                  </div>
                ))}
              </div>

              <textarea
                placeholder="Giải thích (tùy chọn)"
                className="w-full border rounded-lg p-2 mt-4"
                value={q.explanation}
                onChange={(e) =>
                  handleInputChange(i, "explanation", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            ➕ Thêm câu hỏi
          </button>

          <button
            type="submit"
            className="block w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 mt-6"
          >
            🚀 Lưu danh sách câu hỏi
          </button>
        </form>
      </div>
    </div>
  );
}
