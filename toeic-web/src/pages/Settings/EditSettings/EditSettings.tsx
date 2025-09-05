import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Sử dụng react-icons cho biểu tượng mắt (hiển thị/ẩn mật khẩu)
import LeftSidebarUser from "../../../components/LeftSideBarUser";
import { Link } from "react-router-dom";
const EditSettings: React.FC = () => {
	// State để quản lý hiển thị/ẩn mật khẩu
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	return (
		<div className="min-h-screen flex">
			{/* Left Sidebar */}
			<LeftSidebarUser customHeight="h-auto w-64" />
			{/* Form Cài đặt */}
			<div className="flex-1 bg-gray-50 flex items-center justify-center">
				<div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
					<h1 className="text-2xl font-semibold text-blue-600 mb-6">
						Thông tin tài khoản
					</h1>
					<form className="space-y-6">
						{/* Username */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Username
							</label>
							<input
								type="text"
								defaultValue="Khanh Huyen"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Email
							</label>
							<input
								type="email"
								defaultValue="socchut028@gmail.com"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Số điện thoại */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Số điện thoại
							</label>
							<input
								type="tel"
								defaultValue="5968080300"
								className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* Đổi mật khẩu */}
						<div>
							<label className="block text-gray-700 font-semibold mb-2">
								Đổi mật khẩu
							</label>
							<div className="space-y-4">
								{/* Mật khẩu hiện tại */}
								<div className="relative">
									<label className="block text-gray-700 mb-2">
										Mật khẩu hiện tại
									</label>
									<div className="relative flex items-center">
										<input
											type={
												showCurrentPassword ? "text" : "password"
											}
											className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Thêm padding bên phải
										/>
										<button
											type="button"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										>
											{showCurrentPassword ? (
												<FaEyeSlash />
											) : (
												<FaEye />
											)}
										</button>
									</div>
								</div>

								{/* Mật khẩu mới */}
								<div className="relative">
									<label className="block text-gray-700 mb-2">
										Mật khẩu mới
									</label>
									<div className="relative flex items-center">
										<input
											type={showNewPassword ? "text" : "password"}
											className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Thêm padding bên phải
										/>
										<button
											type="button"
											onClick={() =>
												setShowNewPassword(!showNewPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										>
											{showNewPassword ? <FaEyeSlash /> : <FaEye />}
										</button>
									</div>
								</div>

								{/* Xác nhận mật khẩu */}
								<div className="relative">
									<label className="block text-gray-700 mb-2">
										Xác nhận mật khẩu
									</label>
									<div className="relative flex items-center">
										<input
											type={showNewPassword ? "text" : "password"}
											className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Thêm padding bên phải
										/>
										<button
											type="button"
											onClick={() =>
												setShowNewPassword(!showNewPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										>
											{showNewPassword ? <FaEyeSlash /> : <FaEye />}
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Nút Lưu */}
						<div className="text-right pt-10">
							<Link
								to="/settings"
								className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 inline-block text-center"
							>
								Lưu
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditSettings;
