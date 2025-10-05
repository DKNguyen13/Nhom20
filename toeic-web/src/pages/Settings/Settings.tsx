import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftSidebarUser from "../../components/LeftSidebarUser";

const Settings: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const safeValue = (val: string | null | undefined) => val ?? "";

  useEffect(() => {
    setFullname(safeValue(localStorage.getItem("fullname")));
    setEmail(safeValue(localStorage.getItem("email")));
    setPhone(safeValue(localStorage.getItem("phone")));
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <LeftSidebarUser customHeight="h-auto w-64" />

      {/* Form Cài đặt */}
      <div className="flex-1 flex justify-center items-start py-12 px-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Thông tin tài khoản
          </h1>
          <form className="space-y-6">
            {/* Fullname */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Fullname
              </label>
              <input
                type="text"
                value={fullname}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Nút chỉnh sửa */}
            <div className="flex justify-end pt-4">
              <Link
                to="/settings/edit-info"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-sm"
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
