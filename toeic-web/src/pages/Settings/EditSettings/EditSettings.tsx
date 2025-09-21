import React, { useState, useEffect, useRef } from "react";
import LeftSidebarUser from "../../../components/LeftSidebarUser";
import api from "../../../config/axios";

const UpdateProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "privacy" | "password">("basic");

  // Thông tin người dùng
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load dữ liệu từ localStorage
  useEffect(() => {
    setFullname(localStorage.getItem("fullname") || "");
    setEmail(localStorage.getItem("email") || "");
    setAvatarPreview(localStorage.getItem("avatarUrl") || "");
  }, []);

  // Giải phóng object URL khi component unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, avatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Giải phóng URL cũ nếu có
      if (avatarPreview && avatar) {
        URL.revokeObjectURL(avatarPreview);
      }

      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      if (avatar) formData.append("avatar", avatar);

      const res = await api.patch("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Cập nhật thành công!");
        const user = res.data.data;

        // Cập nhật localStorage
        localStorage.setItem("fullname", user.fullname);
        if (user.avatarUrl) {
          localStorage.setItem("avatarUrl", user.avatarUrl);
          setAvatarPreview(user.avatarUrl);
        }

        // Reset input file
        window.location.reload();
        setAvatar(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert(res.data.message || "Có lỗi xảy ra");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <LeftSidebarUser customHeight="h-auto w-64" />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Cập nhật thông tin cá nhân
        </h1>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium ${
              activeTab === "basic" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Thông tin cơ bản
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium ${
              activeTab === "privacy" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Quyền riêng tư
          </button>
          <button
            className={`px-4 py-2 -mb-px border-b-2 font-medium ${
              activeTab === "password" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Thay mật khẩu
          </button>
        </div>

        {activeTab === "basic" && (
          <form className="space-y-4 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <p className="text-sm text-gray-500">{email}</p>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Họ và tên</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={loading}
                ref={fileInputRef}
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="preview"
                  className="mt-2 w-32 h-32 object-cover rounded-full border"
                />
              )}
            </div>

            <div className="text-right pt-4">
              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Lưu"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
