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

//Auto seed packages if not exist
export const seedPackages = async () => {
  const packages = [
    { name: "Basic", durationMonths: 1, originalPrice: 299000, discountedPrice: 249000, type: "basic" },
    { name: "Pro", durationMonths: 6, originalPrice: 499000, discountedPrice: 249000, type: "pro" },
    { name: "Premium", durationMonths: 12, originalPrice: 799000, discountedPrice: 249000, type: "premium" },
  ];

  for (const pkg of packages) {
    const exists = await PremiumPackage.findOne({ type: pkg.type });
    if (!exists) await PremiumPackage.create(pkg);
  }
};
