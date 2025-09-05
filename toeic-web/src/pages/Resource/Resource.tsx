import React, { useState } from "react";
import ResourceCard from "../../components/ResourceCard";

const allResources = [
	{
		id: 1,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 100,
		likes: 50,
	},
	{
		id: 2,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 90,
		likes: 40,
	},
	{
		id: 3,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 80,
		likes: 35,
	},
	{
		id: 4,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 110,
		likes: 12,
	},
	{
		id: 5,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 50,
		likes: 20,
	},
	{
		id: 6,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 60,
		likes: 22,
	},
	{
		id: 7,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 120,
		likes: 18,
	},
	{
		id: 8,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 70,
		likes: 38,
	},
	{
		id: 9,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 200,
		likes: 55,
	},
	{
		id: 10,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 100,
		likes: 50,
	},
	{
		id: 11,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 100,
		likes: 50,
	},
	{
		id: 12,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 100,
		likes: 50,
	},
	{
		id: 13,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 120,
		likes: 14,
	},
	{
		id: 14,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 130,
		likes: 60,
	},
	{
		id: 15,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 45,
		likes: 8,
	},
	{
		id: 16,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 75,
		likes: 14,
	},
	{
		id: 17,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 80,
		likes: 30,
	},
	{
		id: 18,
		imageSrc: "./../src/assets/images/image.png",
		title: "Learning historical words and sentences",
		views: 140,
		likes: 62,
	},
];

const itemsPerPage = 9; // Mỗi trang hiển thị 9 card

const ResourcePage: React.FC = () => {
	// State trang hiện tại (1 hoặc 2)
	const [currentPage, setCurrentPage] = useState(1);

	// Tính tổng số trang dựa trên độ dài data
	const totalPages = Math.ceil(allResources.length / itemsPerPage); // Dự kiến = 2

	// Xác định data của trang hiện tại
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = allResources.slice(startIndex, endIndex);

	// Hàm xử lý bấm sang trang
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Main Content */}
			<div className="container mx-auto flex-1 py-6">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					Tài nguyên
				</h2>
				<div className="flex gap-8">
					{/* Sidebar */}
					<aside className="w-64 bg-white rounded-lg shadow p-4 border border-gray-300 ">
						{/* Search box */}
						<div className="mb-5">
							<input
								type="text"
								placeholder="Tìm kiếm"
								className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{/* Danh mục */}
						<nav>
							<ul className="space-y-3 text-gray-700">
								<li>
									<a
										href="#"
										className="flex items-center p-2 rounded hover:bg-blue-50"
									>
										<span className="ml-2">Từ vựng</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center p-2 rounded hover:bg-blue-50"
									>
										<span className="ml-2">Ngữ pháp</span>
									</a>
								</li>
								<li>
									<a
										href="#"
										className="flex items-center p-2 rounded hover:bg-blue-50"
									>
										<span className="ml-2">Video bài giảng</span>
									</a>
								</li>
							</ul>
						</nav>
					</aside>

					{/* Resource Grid */}
					<main className="flex-1">
						<div className="grid grid-cols-3 gap-6">
							{currentData.map((res) => (
								<ResourceCard
									key={res.id}
									id={res.id}
									imageSrc={res.imageSrc}
									title={res.title}
									views={res.views}
									likes={res.likes}
								/>
							))}
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-center mt-8 space-x-2">
							{/* Trang trước */}
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
							>
								Trang trước
							</button>

							{/* Hiển thị page 1,2 (vì totalPages=2) */}
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`px-3 py-1 border rounded hover:bg-blue-50 ${
											currentPage === page
												? "bg-blue-600 text-white"
												: ""
										}`}
									>
										{page}
									</button>
								)
							)}

							{/* Trang sau */}
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border rounded hover:bg-blue-50 disabled:opacity-50"
							>
								Trang sau
							</button>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default ResourcePage;
