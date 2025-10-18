import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../../../config/axios";

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
  label: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  title: string;
  questionNumber: number;
  globalQuestionNumber: number;
  content: {
    transcriptId: string;
    question: string;
    image?: string;
  };
  choices: Choice[];
  correctAnswer: string;
  explanation: string;
}

const CreateQuestionPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedTestSlug, setSelectedTestSlug] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      title: "",
      questionNumber: 1,
      globalQuestionNumber: 1,
      content: { transcriptId: "", question: "", image: "" },
      choices: [
        { label: "A", text: "", isCorrect: false },
        { label: "B", text: "", isCorrect: false },
        { label: "C", text: "", isCorrect: false },
        { label: "D", text: "", isCorrect: false },
      ],
      correctAnswer: "",
      explanation: "",
    },
  ]);

  // 🔹 Load danh sách đề thi
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
          const res = await api.get(`/test/${selectedTestSlug}/parts`);
          console.log('list part', res);
          setParts(res.data.data?.partWithCounts || []);
        } catch (err) {
          console.error("Lỗi tải danh sách part:", err);
          setParts([]);
        }
      };
      fetchParts();

    }
  }, [selectedTestSlug]);

  // 🔹 Thêm câu hỏi mới
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        questionNumber: questions.length + 1,
        globalQuestionNumber: questions.length + 1,
        content: { transcriptId: "", question: "", image: "" },
        choices: [
          { label: "A", text: "", isCorrect: false },
          { label: "B", text: "", isCorrect: false },
          { label: "C", text: "", isCorrect: false },
          { label: "D", text: "", isCorrect: false },
        ],
        correctAnswer: "",
        explanation: "",
      },
    ]);
  };

  // 🔹 Cập nhật thông tin câu hỏi
  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[key] = value;
    setQuestions(updated);
  };

  // 🔹 Gửi danh sách câu hỏi
  const handleSubmit = async () => {
    if (!selectedTestSlug || !selectedPartId) {
      alert("Vui lòng chọn đề thi và part!");
      return;
    }

    try {
      await api.post(
        `/test/${selectedTestSlug}/parts/${selectedPartId}/questions`,
        { questions }
      );
      alert("Tạo danh sách câu hỏi thành công 🎉");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo câu hỏi!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Tạo danh sách câu hỏi TOEIC</h1>

      {/* 🔹 Chọn đề thi */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Chọn đề thi</label>
        <select
          className="w-full border rounded p-2"
          value={selectedTestSlug}
          onChange={(e) => setSelectedTestSlug(e.target.value)}
        >
          <option value="">-- Chọn đề thi --</option>
          {tests.map((test) => (
            <option key={test.slug} value={test.slug}>
              {test.title}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Chọn part */}
      {parts.length > 0 && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Chọn part</label>
          <select
            className="w-full border rounded p-2"
            value={selectedPartId}
            onChange={(e) => setSelectedPartId(e.target.value)}
          >
            <option value="">-- Chọn part --</option>
            {parts.map((part) => (
              <option key={part._id} value={part._id}>
                {part.title} (Part {part.partNumber})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🔹 Danh sách câu hỏi */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-sm bg-white space-y-3"
          >
            <h3 className="font-semibold">Câu hỏi {index + 1}</h3>

            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Tiêu đề câu hỏi"
              value={q.title}
              onChange={(e) => updateQuestion(index, "title", e.target.value)}
            />

            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Transcript ID (dành cho các câu hỏi thuộc part 3, 4, 6, 7)"
              value={q.content.transcriptId}
              onChange={(e) =>
                updateQuestion(index, "content", {
                  ...q.content,
                  transcriptId: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Nội dung câu hỏi (nếu có)"
              value={q.content.question}
              onChange={(e) =>
                updateQuestion(index, "content", {
                  ...q.content,
                  question: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Ảnh minh họa (URL)"
              value={q.content.image}
              onChange={(e) =>
                updateQuestion(index, "content", {
                  ...q.content,
                  image: e.target.value,
                })
              }
            />

            {/* Lựa chọn */}
            <div>
              <h4 className="font-medium mb-1">Lựa chọn:</h4>
              {q.choices.map((choice, cIndex) => (
                <div key={cIndex} className="flex items-center gap-2 mb-1">
                  <span className="w-6">{choice.label}.</span>
                  <input
                    type="text"
                    className="flex-1 border rounded p-2"
                    placeholder={`Đáp án ${choice.label}`}
                    value={choice.text}
                    onChange={(e) => {
                      const newChoices = [...q.choices];
                      newChoices[cIndex].text = e.target.value;
                      updateQuestion(index, "choices", newChoices);
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={(e) => {
                      const newChoices = q.choices.map((ch) => ({
                        ...ch,
                        isCorrect: false,
                      }));
                      newChoices[cIndex].isCorrect = e.target.checked;
                      updateQuestion(index, "choices", newChoices);
                      updateQuestion(
                        index,
                        "correctAnswer",
                        choice.label
                      );
                    }}
                  />
                  <span>Đúng</span>
                </div>
              ))}
            </div>

            <textarea
              className="w-full border rounded p-2"
              placeholder="Giải thích"
              value={q.explanation}
              onChange={(e) =>
                updateQuestion(index, "explanation", e.target.value)
              }
            ></textarea>
          </div>
        ))}
      </div>

      {/* 🔹 Thao tác */}
      <div className="mt-6 flex gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={addQuestion}
        >
          + Thêm câu hỏi
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSubmit}
        >
          🚀 Tạo danh sách câu hỏi
        </button>
      </div>
    </div>
  );
};

export default CreateQuestionPage;
