import React, { useEffect, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import api from "../../../config/axios";

interface User {
  id: number;
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  authType: string;
  registerDate?: string;
  status?: "Active" | "Inactive";
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Fetch users from backend
  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=${pageSize}`);
      const data = res.data.data;

      setUsers(
        data.users.map((user: any, index: number) => ({
          id: (page - 1) * pageSize + index + 1,
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          authType: user.authType || 'normal',
          registerDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "",
          status: user.isActive ? "Active" : "Inactive",
        }))
      );
      setTotalUsers(data.total);
    } catch (err) {
      console.error("Lấy danh sách người dùng lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  // Toggle dropdown menu
  const toggleMenu = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuOpenId(menuOpenId === userId ? null : userId);
    setMenuPosition({
      x: rect.right - 160, // lùi một chút cho vừa khung
      y: rect.bottom + window.scrollY,
    });
  };


  // Inactivate / Activate user
  const handleToggleStatus = async (user: User) => {
    try {
      await api.patch("/admin/activate", { email: user.email });
      setUsers((prev) =>
        prev.map((u) =>
          u.email === user.email
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
        )
      );
      setMenuOpenId(null);
    } catch (err) {
      console.error("Cập nhật trạng thái lỗi:", err);
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen flex flex-row">
      <LeftSidebarAdmin customHeight="h-auto w-64" />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Quản lý người dùng
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-4">
          <table className="w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Tên</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Số điện thoại</th>
                <th className="px-6 py-3 text-left">Loại đăng nhập</th>
                <th className="px-6 py-3 text-left">Ngày đăng ký</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-center">Tùy chọn</th>
              </tr>
            </thead>
            <tbody> {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-t relative">
                    <td className="px-6 py-3">{user.id}</td>
                    <td className="px-6 py-3">{user.fullname}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.phone}</td>
                    <td className="px-6 py-3 capitalize">
                      {user.authType === "google" ? "Google" : "Thường"}
                    </td>
                    <td className="px-6 py-3">{user.registerDate}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-white ${
                          user.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center relative">
                      <button className="text-gray-600 hover:text-gray-900"
                        onClick={(e) => toggleMenu(user._id, e)}>
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 italic bg-gray-50"> Chưa có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex justify-center space-x-4 mt-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"> Trước
            </button>
            <span className="px-4 py-2">
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"> Sau
            </button>
          </div>
        )}

      </div>
      {menuOpenId && menuPosition && (
      <div
        className="fixed bg-white shadow-lg border rounded w-40 z-[9999]"
        style={{
          top: `${menuPosition.y}px`,
          left: `${menuPosition.x}px`,
        }}
      >
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100"
          onClick={() => {
            const user = users.find((u) => u._id === menuOpenId);
            if (user) handleToggleStatus(user);
          }}
        >
          {users.find((u) => u._id === menuOpenId)?.status === "Active"
            ? "Vô hiệu hóa"
            : "Kích hoạt"}
        </button>
      </div>
    )}
    </div>
  );
};

export default UserManagementPage;
