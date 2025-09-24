import PremiumPackage from '../models/premiumPackage.models.js';

//CRUD PremiumPackage
export const createPackage = async (data) => {
  const exists = await PremiumPackage.findOne({ type: data.type });
  if (exists) throw new Error('Gói đã tồn tại');
  return await PremiumPackage.create(data);
};

export const getAllPackages = async () => {
  return await PremiumPackage.find().sort({ createdAt: -1 });
};

export const getPackageById = async (id) => {
  const pkg = await PremiumPackage.findById(id);
  if (!pkg) throw new Error('Gói không tồn tại');
  return pkg;
};

export const updatePackage = async (id, data) => {
  const pkg = await PremiumPackage.findByIdAndUpdate(id, data, { new: true });
  if (!pkg) throw new Error('Gói không tồn tại');
  return pkg;
};

export const deletePackage = async (id) => {
  const pkg = await PremiumPackage.findByIdAndDelete(id);
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
