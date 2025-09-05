import React from "react";
import { FaEye, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ResourceCardProps {
  id: number;
  imageSrc: string; // Đường dẫn ảnh
  title: string; // Tiêu đề
  views: number; // Lượt xem
  likes: number; // Lượt yêu thích
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  imageSrc,
  title,
  views,
  likes,
}) => {
  return (
    <div className="bg-white rounded-md shadow p-4 flex flex-col">
      <img
        src={imageSrc}
        alt="Resource"
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-gray-800 font-semibold mb-2">{title}</h3>
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <FaEye />
          <span>{views}+</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaHeart />
          <span>{likes}</span>
        </div>
      </div>
      <Link to={`${id}`}>
        <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 text-sm">
          Xem chi tiết
        </button>
      </Link>
    </div>
  );
};

export default ResourceCard;
