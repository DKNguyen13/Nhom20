import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import { FaEye, FaHeart } from "react-icons/fa";

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.data.data);
      } catch (err) {
        console.error("Lỗi khi tải lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
  if (!lesson) return <p className="p-4">Không tìm thấy bài học</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      <div className="flex items-center gap-6 text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <FaEye className="text-gray-400" />
          <span>{lesson.views || 0} lượt xem</span>
        </div>
        <div className="flex items-center gap-2">
          <FaHeart className="text-red-400" />
          <span>{lesson.likes || 0} yêu thích</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
          {lesson.type}
        </span>
      </div>

      {/* Render nội dung bài học */}
      <div
        className="article-content prose"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
    </div>
  );
};

export default LessonDetailPage;
