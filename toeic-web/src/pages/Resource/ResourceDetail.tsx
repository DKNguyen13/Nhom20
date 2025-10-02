import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import { FaEye, FaHeart } from "react-icons/fa";

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State favorite
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Fetch lesson detail
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/${id}`);
        const data = res.data.data;
        setLesson(data);

        // Set favorite từ API
        setIsFavorite(data.isFavorite || false);
        setFavoriteCount(data.favoriteCount || 0);
      } catch (err) {
        console.error("Lỗi khi tải lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!lesson) return;
    try {
      const res = await api.patch("/wishlist/toggle", { lessonId: lesson._id });
      setIsFavorite(res.data.data.isFavorite);
      setFavoriteCount(prev => prev + (res.data.data.isFavorite ? 1 : -1));
    } catch (err) {
      console.error("Lỗi khi cập nhật wishlist:", err);
    }
  };

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
  if (!lesson) return <p className="p-4">Không tìm thấy bài học</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      <div className="flex items-center gap-6 text-gray-600 mb-6">
        {/* Views */}
        <div className="flex items-center gap-2">
          <FaEye className="text-gray-400" />
          <span>{lesson.views || 0} lượt xem</span>
        </div>

        {/* Favorite */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleToggleFavorite}
        >
          <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
          <span>{favoriteCount} yêu thích</span>
        </div>

        {/* Type */}
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
