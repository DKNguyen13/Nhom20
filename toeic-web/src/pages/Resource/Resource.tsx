import React, { useState, useEffect } from "react";
import ResourceCard from "../../components/ResourceCard";
import api from "../../config/axios";

const itemsPerPage = 9;

const types = [
  { key: "all", label: "Tất cả" },
  { key: "vocabulary", label: "Từ vựng" },
  { key: "reading", label: "Đọc hiểu" },
  { key: "grammar", label: "Ngữ pháp" },
  { key: "video", label: "Video bài giảng" },
];

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get("/lessons");
        setResources(res.data.data);
      } catch (err) {
        console.error("Lỗi load resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter theo type
  const filteredResources =
    selectedType === "all"
      ? resources
      : resources.filter((res) => res.type === selectedType);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredResources.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (loading) {
    return <p className="p-4">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto flex-1 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tài nguyên</h2>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-gray-200 transition-all duration-300">
            {/* Search Box */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="space-y-1.5 text-gray-700">
                {types.map((t) => (
                  <li key={t.key}>
                    <button
                      onClick={() => {
                        setSelectedType(t.key);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-lg transition-all ${
                        selectedType === t.key
                          ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}>
                      <span className="text-sm">{t.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Resource Grid */}
          <main className="flex-1">
            {filteredResources.length === 0 ? (
              <p className="text-center text-gray-600 text-lg font-medium py-20">
                Chưa có bài học
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-6">
                  {currentData.map((res) => (
                    <ResourceCard
                      key={res._id}
                      id={res._id}
                      imageSrc={res.imageSrc || "./../src/assets/images/lesson.png"}
                      title={res.title}
                      views={res.views || 0}
                      likes={res.favoriteCount || 0}
                      type={res.type}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
                    >
                      Trang trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded hover:bg-blue-50 ${
                          currentPage === page ? "bg-blue-600 text-white" : ""
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
