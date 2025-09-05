import React from "react";
import { FaEllipsisH } from "react-icons/fa";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";

const users = [
	{
		id: "00001",
		name: "Christine Brooks",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00002",
		name: "Rosie Pearson",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Offline",
	},
	{
		id: "00003",
		name: "Darrell Caldwell",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00004",
		name: "Gilbert Johnston",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00005",
		name: "Alan Cain",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00006",
		name: "Alfred Murray",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00007",
		name: "Maggie Sullivan",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00008",
		name: "Rosie Todd",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
	{
		id: "00009",
		name: "Dollie Hines",
		email: "socchuot@gmail.com",
		phone: "48234923",
		registerDate: "20/03/2025",
		status: "Online",
	},
];

const UserManagementPage: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-row">
			{/* Sidebar Admin */}
			<LeftSidebarAdmin customHeight="h-auto w-64" />

			{/* Main Content */}
			<div className="flex-1 p-8 bg-gray-100">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Quản lý người dùng
				</h1>

				{/* Bảng người dùng */}
				<div className="overflow-x-auto bg-white rounded-lg shadow-md">
					<table className="w-full table-auto">
						<thead className="bg-blue-600 text-white">
							<tr>
								<th className="px-6 py-3 text-left">ID</th>
								<th className="px-6 py-3 text-left">Tên</th>
								<th className="px-6 py-3 text-left">Email</th>
								<th className="px-6 py-3 text-left">Số điện thoại</th>
								<th className="px-6 py-3 text-left">Ngày đăng ký</th>
								<th className="px-6 py-3 text-left">Trạng thái</th>
								<th className="px-6 py-3 text-center">Tùy chọn</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id} className="border-t">
									<td className="px-6 py-3">{user.id}</td>
									<td className="px-6 py-3">{user.name}</td>
									<td className="px-6 py-3">{user.email}</td>
									<td className="px-6 py-3">{user.phone}</td>
									<td className="px-6 py-3">{user.registerDate}</td>
									<td className="px-6 py-3">
										<span
											className={`inline-block px-3 py-1 rounded-full text-white ${
												user.status === "Online"
													? "bg-green-500"
													: "bg-gray-400"
											}`}
										>
											{user.status}
										</span>
									</td>
									<td className="px-6 py-3 text-center">
										<button className="text-gray-600 hover:text-gray-900">
											<FaEllipsisH />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UserManagementPage;
