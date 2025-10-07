import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";
import api from "../../../config/axios";

interface Package {
  _id: string; // BE trả về sẽ có _id
  name: string;
  type: "basic" | "pro" | "premium";
  durationMonths: number;
  originalPrice: number;
  discountedPrice: number;
  description?: string;
}

const VipManagementPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gói từ BE
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/vip");
        const order = ["basic", "advanced", "premium"];
        const sorted = res.data.data.sort(
          (a: Package, b: Package) =>
            order.indexOf(a.type) - order.indexOf(b.type)
        );
        setPackages(sorted);
      } catch (err: any) {
        console.error("Lỗi lấy gói VIP:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleFieldChange = (
    index: number,
    field: "originalPrice" | "discountedPrice" | "description",
    value: string | number
  ) => {
    const updated = [...packages];

    if (field === "originalPrice" || field === "discountedPrice") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setPackages(updated);
  };

  const handleSave = async (pkg: Package) => {
    try {
      await api.put(`/vip/${pkg._id}`, {
        originalPrice: pkg.originalPrice,
        discountedPrice: pkg.discountedPrice,
        description: pkg.description,
      });
      alert(`Lưu thành công gói ${pkg.name}`);
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại");
    }
  };

  if (loading) {
    return <div className="p-8">Đang tải gói VIP...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <LeftSidebarAdmin customHeight="h-auto w-64" />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý gói VIP</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={pkg._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="mb-2">Thời hạn: {pkg.durationMonths} tháng</p>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả:
                </label>
                <textarea
                  value={pkg.description || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "description", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                  rows={2}
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giá gốc:
                </label>
                <input
                  type="number"
                  value={pkg.originalPrice}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "originalPrice",
                      Number(e.target.value)
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Giá giảm:
                </label>
                <input
                  type="number"
                  value={pkg.discountedPrice}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "discountedPrice",
                      Number(e.target.value)
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <button
                onClick={() => handleSave(pkg)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FaSave /> Lưu
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipManagementPage;
