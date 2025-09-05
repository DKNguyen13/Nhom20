import React from "react";
import { Link } from "react-router-dom"; // Thêm Link từ react-router-dom
import LeftSidebarUser from "../../components/LeftSideBarUser";

const Settings: React.FC = () => {
	return (
		<div className="min-h-screen flex">
			{/* Left Sidebar */}
			<LeftSidebarUser customHeight="h-auto w-64" />
			{/* Form Cài đặt */}
			<div className="flex-1 bg-gray-50 flex justify-center pt-5 pb-96">
				<div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
					<h1 className="text-2xl font-semibold text-blue-600 mb-6">
						Thông tin tài khoản
					</h1>
					<form className="space-y-4">
						{/* Username */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Username
							</label>
							<input
								type="text"
								value="Khanh Huyen"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
								readOnly
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Email
							</label>
							<input
								type="email"
								value="socchut028@gmail.com"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
								readOnly
							/>
						</div>

						{/* Số điện thoại */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Số điện thoại
							</label>
							<input
								type="tel"
								value="5968080300"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
								readOnly
							/>
						</div>

						{/* Nút Lưu (Sử dụng Link để điều hướng) */}
						<div className="text-right pt-10">
							<Link
								to="/settings/editsettings" // Điều hướng đến trang /settings
								className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 inline-block text-center"
							>
								Chỉnh sửa
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Settings;
