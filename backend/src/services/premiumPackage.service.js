import PremiumPackage from '../models/premiumPackage.models.js';

// Get all packages
export const getAllPackages = async () => {
  const packages = await PremiumPackage.find();
  const order = ["basic", "pro", "premium"];
  return packages.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
};

// Get package by id
export const getPackageById = async (id) => {
  const pkg = await PremiumPackage.findById(id);
  if (!pkg) throw new Error('Gói không tồn tại');
  return pkg;
};

// Update data
export const updatePackage = async (id, data) => {
  const allowedUpdates = {
    originalPrice: data.originalPrice,
    discountedPrice: data.discountedPrice,
    description: data.description
  };

  if (allowedUpdates.discountedPrice > allowedUpdates.originalPrice) throw new Error('Giá giảm không được lớn hơn giá gốc');

  const pkg = await PremiumPackage.findByIdAndUpdate(id, allowedUpdates, { new: true });
  if (!pkg) throw new Error('Gói không tồn tại');
  return pkg;
};
