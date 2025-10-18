import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../config/axios";

// =================== Interfaces ===================
interface Test {
  slug: string;
  title: string;
}

interface PartConfig {
  hasAudio: boolean;
  allowReplay: boolean;
  showQuestionNumber: boolean;
  allowBack: boolean;
}

interface PartData {
  title: string;
  partNumber: number;
  category: string;
  description: string;
  instructions: string;
  audioFile: string | null;
  totalQuestions: number;
  config: PartConfig;
  tags: string[];
}

// =================== Component ===================
const CreatePartPage: React.FC = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestSlug, setSelectedTestSlug] = useState<string>("");
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<PartData>({
    title: "",
    partNumber: 1,
    category: "",
    description: "",
    instructions: "",
    audioFile: "",
    totalQuestions: 0,
    config: {
      hasAudio: false,
      allowReplay: true,
      showQuestionNumber: true,
      allowBack: true,
    },
    tags: [],
  });

  // =================== Fetch Tests ===================
  useEffect(() => {
    const fetchTests = async () => {
      setLoadingTests(true);
      try {
        const res = await api.get("/test"); // 👈 endpoint lấy danh sách đề thi
        const data = res.data.data.tests;
        console.log("tests: ", data);
        if (Array.isArray(data)) {
          setTests(data);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err: any) {
        setError("Không thể tải danh sách đề thi");
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  // =================== Handle Input ===================
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;

    // Checkbox trong config
    if (["hasAudio", "allowReplay", "showQuestionNumber", "allowBack"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        config: { ...prev.config, [name]: type === "checkbox" ? checked : value },
      }));
      return;
    }

    // Mảng tags
    if (name === "tags") {
      const tagsArray = value.split(",").map((t) => t.trim());
      setFormData((prev) => ({ ...prev, tags: tagsArray }));
      return;
    }

    // Số nguyên
    if (name === "partNumber" || name === "totalQuestions") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    // Các field còn lại
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =================== Submit ===================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTestSlug) {
      setError("Vui lòng chọn đề thi trước khi tạo Part!");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await api.post(`/test/${selectedTestSlug}/parts`, formData);

      if (!response) throw new Error("Không thể tạo Part mới");

      setSuccess("✅ Tạo Part thành công!");
      setFormData({
        title: "",
        partNumber: 1,
        category: "",
        description: "",
        instructions: "",
        audioFile: "",
        totalQuestions: 0,
        config: {
          hasAudio: false,
          allowReplay: true,
          showQuestionNumber: true,
          allowBack: true,
        },
        tags: [],
      });
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo Part");
    } finally {
      setSubmitting(false);
    }
  };

  // =================== UI ===================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🧩 Tạo mới Part TOEIC
        </h1>

        {/* Chọn đề thi */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chọn đề thi
          </label>
          <select
            value={selectedTestSlug}
            onChange={(e) => setSelectedTestSlug(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Chọn đề thi --</option>
            {loadingTests ? (
              <option disabled>Đang tải...</option>
            ) : (
              tests.map((test) => (
                <option key={test.slug} value={test.slug}>
                  {test.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Form tạo Part */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề Part
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="VD: Part 7 - Reading Comprehension"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Part
              </label>
              <input
                type="number"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng câu hỏi
              </label>
              <input
                type="number"
                name="totalQuestions"
                value={formData.totalQuestions}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Listening / Reading"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Nhập mô tả cho phần thi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hướng dẫn
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 h-20"
              placeholder="Nhập hướng dẫn làm bài..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audio file (tùy chọn)
            </label>
            <input
              type="text"
              name="audioFile"
              value={formData.audioFile || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="URL file audio (nếu có)"
            />
          </div>

          {/* Config Options */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">⚙️ Cấu hình Part</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(formData.config).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={key}
                    checked={(formData.config as any)[key]}
                    onChange={handleChange}
                  />
                  <span className="text-sm">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (phân tách bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(", ")}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="VD: ETS, Reading"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Quay lại
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Đang tạo..." : "Tạo Part"}
            </button>
          </div>
        </form>

        {/* Hiển thị thông báo */}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </div>
    </div>
  );
};

export default CreatePartPage;
