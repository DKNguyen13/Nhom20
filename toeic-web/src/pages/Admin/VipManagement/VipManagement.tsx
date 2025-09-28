import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import LeftSidebarAdmin from "../../../components/LeftSidebarAdmin";

interface Package {
  name: string;
  type: "basic" | "pro" | "premium";
  durationMonths: number;
  originalPrice: number;
  discountedPrice: number;
  description?: string;
}

const initialPackages: Package[] = [
  { name: "Basic", type: "basic", durationMonths: 1, originalPrice: 100, discountedPrice: 80, description: "Gói cơ bản" },
  { name: "Pro", type: "pro", durationMonths: 6, originalPrice: 500, discountedPrice: 450, description: "Gói nâng cao" },
  { name: "Premium", type: "premium", durationMonths: 12, originalPrice: 900, discountedPrice: 800, description: "Gói cao cấp" },
];

const VipManagementPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);

  const handlePriceChange = (index: number, field: "originalPrice" | "discountedPrice", value: number) => {
    const updated = [...packages];
    updated[index][field] = value;
    setPackages(updated);
  };

  const handleSave = (pkg: Package) => {
    console.log("Lưu gói:", pkg);
    alert(`Lưu thành công gói ${pkg.name} với giá gốc ${pkg.originalPrice} và giá giảm ${pkg.discountedPrice}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <LeftSidebarAdmin customHeight="h-auto w-64" />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý gói VIP</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div key={pkg.type} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-2">{pkg.description}</p>
              <p className="mb-2">Thời hạn: {pkg.durationMonths} tháng</p>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Giá gốc:</label>
                <input
                  type="number"
                  value={pkg.originalPrice}
                  onChange={(e) => handlePriceChange(index, "originalPrice", Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Giá giảm:</label>
                <input
                  type="number"
                  value={pkg.discountedPrice}
                  onChange={(e) => handlePriceChange(index, "discountedPrice", Number(e.target.value))}
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
