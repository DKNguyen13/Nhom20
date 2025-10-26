import React, { useEffect, useState } from "react";
import api from "../../../../config/axios.js";
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

interface Group {
  id?: string;
  text?: string;
  image?: File | null;
  audio?: File | null;
}

interface Question {
  title: string;
  partNumber: number;
  questionNumber: number;
  globalQuestionNumber: number;
  group?: Group | null;
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
  const [groups, setGroups] = useState<Group[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);

  // -------------------- FETCH TESTS --------------------
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

  // -------------------- FETCH PARTS --------------------
  useEffect(() => {
    if (selectedTestSlug) {
      const fetchParts = async () => {
        try {
          const data = await getAllParts(selectedTestSlug);
          setParts(data?.partWithCounts || []);
        } catch (err: any) {
          console.error("Lỗi tải danh sách part:", err.message);
        }
      };
      fetchParts();
    }
  }, [selectedTestSlug]);

  // -------------------- UTILS --------------------
  const getDefaultChoices = (partNumber: number): Choice[] => {
    const base = [
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
      { label: "C", text: "", isCorrect: false },
      { label: "D", text: "", isCorrect: false },
    ];
    return partNumber === 2 ? base.slice(0, 3) : base;
  };

  const isGroupedPart = (partNumber: number) =>
    [3, 4, 6, 7].includes(partNumber);

  // -------------------- HANDLE PART CHANGE --------------------
  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
    const selectedPart = parts.find((p) => p._id === partId);
    if (!selectedPart) return;

    const partNumber = selectedPart.partNumber;
    setGroups([]);
    setQuestions([]);
  };

  // -------------------- GROUP MANAGEMENT --------------------
  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", image: null, audio: null },
    ]);
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setQuestions((prev) => prev.filter((q) => q.group?.id !== groupId));
  };

  const handleGroupChange = (
    groupId: string,
    field: keyof Group,
    value: any
  ) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, [field]: value } : g))
    );
  };

  // -------------------- QUESTION MANAGEMENT --------------------
  const handleAddQuestion = (groupId?: string) => {
    const selectedPart = parts.find((p) => p._id === selectedPartId);
    if (!selectedPart) return;

    const partNumber = selectedPart.partNumber;
    const newQuestion: Question = {
      title: "",
      partNumber,
      questionNumber: questions.length + 1,
      globalQuestionNumber: questions.length + 1,
      question: "",
      choices: getDefaultChoices(partNumber),
      correctAnswer: "A",
      explanation: "",
      group: isGroupedPart(partNumber)
        ? groups.find((g) => g.id === groupId) || null
        : null,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    field: keyof Choice,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: q.choices.map((c, j) =>
                j === cIndex ? { ...c, [field]: value } : c
              ),
            }
          : q
      )
    );
  };

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPart = parts.find((p) => p._id === selectedPartId);
    if (!selectedPart || !selectedTestSlug) {
      alert("Vui lòng chọn đề thi và part!");
      return;
    }

    const formData = new FormData();
    formData.append("slug", selectedTestSlug);
    formData.append("partId", selectedPartId);

    const cleanedQuestions = questions.map((q, index) => ({
      ...q,
      group: q.group
        ? {
            text: q.group.text,
            image: q.group.image ? `image_${index}` : "",
            audio: q.group.audio ? `audio_${index}` : "",
            groupId: q.group.id,
          }
        : null,
    }));

    formData.append("questions", JSON.stringify(cleanedQuestions));

    // ✅ Đổi lại thứ tự tên field để khớp với BE
    groups.forEach((g, index) => {
      if (g.image) formData.append(`image_${index}`, g.image);
      if (g.audio) formData.append(`audio_${index}`, g.audio);
    });

    questions.forEach((q, index) => {
      if (q.group?.image) formData.append(`image_${index}`, q.group.image);
      if (q.group?.audio) formData.append(`audio_${index}`, q.group.audio);
    });

    try {
      const res = await api.post(`/question`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Tạo câu hỏi thành công!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi khi tạo câu hỏi!");
    }
  };

  // -------------------- RENDER --------------------
  const selectedPart = parts.find((p) => p._id === selectedPartId);
  const partNumber = selectedPart?.partNumber ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          📝 Tạo danh sách câu hỏi
        </h1>

        {/* Test & Part */}
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
              onChange={(e) => handleSelectPart(e.target.value)}
            >
              <option value="">-- Chọn part --</option>
              {parts.map((part) => (
                <option key={part._id} value={part._id}>
                  Part {part.partNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Nếu part có group */}
          {isGroupedPart(partNumber) ? (
            <>
              {groups.map((group, gi) => (
                <div
                  key={group.id}
                  className="border border-blue-300 rounded-2xl p-6 bg-blue-50 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-blue-700">
                      Group #{gi + 1}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(group.id!)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa nhóm
                    </button>
                  </div>

                  <textarea
                    className="w-full border rounded-lg p-2 mb-3"
                    placeholder="Nội dung đoạn văn hoặc mô tả"
                    value={group.text}
                    onChange={(e) =>
                      handleGroupChange(group.id!, "text", e.target.value)
                    }
                  />

                  <div className="flex gap-4 mb-3">
                    <div>
                      <label className="text-sm text-gray-600">Ảnh</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleGroupChange(
                            group.id!,
                            "image",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Âm thanh</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleGroupChange(
                            group.id!,
                            "audio",
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </div>
                  </div>

                  {questions
                    .filter((q) => q.group?.id === group.id)
                    .map((q, qi) => (
                      <div
                        key={qi}
                        className="border border-blue-200 rounded-xl bg-white p-4 mb-4"
                      >
                        <input
                          type="text"
                          placeholder="Câu hỏi"
                          className="border rounded-lg p-2 w-full"
                          value={q.question}
                          onChange={(e) =>
                            handleInputChange(
                              questions.indexOf(q),
                              "question",
                              e.target.value
                            )
                          }
                        />

                        {q.choices.map((c, ci) => (
                          <div
                            key={ci}
                            className="flex items-center gap-2 mt-2 bg-blue-50 p-2 rounded-lg"
                          >
                            <span className="font-bold">{c.label}.</span>
                            <input
                              type="text"
                              className="flex-1 border rounded-lg p-1"
                              value={c.text}
                              onChange={(e) =>
                                handleChoiceChange(
                                  questions.indexOf(q),
                                  ci,
                                  "text",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="radio"
                              name={`correct-${q.globalQuestionNumber}`}
                              checked={q.correctAnswer === c.label}
                              onChange={() =>
                                handleInputChange(
                                  questions.indexOf(q),
                                  "correctAnswer",
                                  c.label
                                )
                              }
                            />
                            <span className="text-sm">Đúng</span>
                          </div>
                        ))}
                      </div>
                    ))}

                  <button
                    type="button"
                    onClick={() => handleAddQuestion(group.id!)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    ➕ Thêm câu hỏi vào nhóm này
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddGroup}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                ➕ Thêm nhóm mới
              </button>
            </>
          ) : (
            <>
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="border border-blue-200 rounded-2xl p-6 shadow-sm bg-blue-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-blue-700">
                      Câu hỏi #{i + 1} (Part {q.partNumber})
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(i)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Câu hỏi"
                    className="border rounded-lg p-2 w-full"
                    value={q.question}
                    onChange={(e) =>
                      handleInputChange(i, "question", e.target.value)
                    }
                  />
                  {/* --- Upload files --- */}
                  <div className="flex gap-4 mt-3">
                    <div>
                      <label className="text-sm text-gray-600">Ảnh</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleInputChange(i, "group", {
                            ...(q.group || {}),
                            image: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Âm thanh</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleInputChange(i, "group", {
                            ...(q.group || {}),
                            audio: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>
                  </div>

                  {q.choices.map((c, ci) => (
                    <div
                      key={ci}
                      className="flex items-center gap-2 mt-2 bg-white p-2 rounded-lg"
                    >
                      <span className="font-bold">{c.label}.</span>
                      <input
                        type="text"
                        className="flex-1 border rounded-lg p-1"
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
              ))}

              <button
                type="button"
                onClick={() => handleAddQuestion()}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                ➕ Thêm câu hỏi
              </button>
            </>
          )}

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
