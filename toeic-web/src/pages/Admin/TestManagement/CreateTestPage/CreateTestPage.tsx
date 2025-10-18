import React, { useState, ChangeEvent, FormEvent } from "react";
import api from "../../../../config/axios";
import { useNavigate } from "react-router-dom";

interface TestData {
  title: string;
  audio: string;
  testCode: string;
}

const CreateTestPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TestData>({
    title: "",
    audio: "",
    testCode: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "source") {
      setFormData((prev) => ({ ...prev, metadata: { source: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await api.post("/test", formData);
      console.log("Create Test", res);
      setSuccess("✅ Tạo đề thi thành công!");
      setFormData({
        title: "",
        audio: "",
        testCode: "",
      });
    } catch (err: any) {
      console.error("Lỗi khi tạo đề thi:", err);
      setError("❌ Không thể tạo đề thi. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📝 Tạo mới đề thi TOEIC
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đề thi
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: 2024 Practice Set TOEIC Test 1"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Audio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn Audio
            </label>
            <input
              type="url"
              name="audio"
              value={formData.audio}
              onChange={handleChange}
              placeholder="https://cdn.yourdomain.com/audio/test1.mp3"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Test Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã đề thi
            </label>
            <input
              type="text"
              name="testCode"
              value={formData.testCode}
              onChange={handleChange}
              placeholder="VD: ETS2024T1"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-3">
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
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
            >
              {submitting ? "Đang tạo..." : "Tạo đề thi"}
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

export default CreateTestPage;
