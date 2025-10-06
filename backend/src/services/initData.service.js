import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Lesson from "../models/lesson.model.js";
import VipPackage from "../models/vipPackage.model.js";
import { syncUsersToMeili } from "../utils/meiliSync.js";
import PaymentOrder from "../models/paymentOrder.model.js";

// Sync mail
export const syncMeiliUsersOnce = async () => {
  try {
    console.log("Syncing existing users to Meilisearch...");
    await syncUsersToMeili();
    console.log("Meilisearch sync complete!");
  } catch (err) {
    console.error("Error syncing Meilisearch:", err);
  }
};

// Seed revenue
export const seedRevenue = async () => {
  const count = await PaymentOrder.countDocuments();
  if (count > 0) {
    console.log("💰 PaymentOrders already exist, skip seeding...");
    return;
  }

  const fakeOrders = [];

  for (let year of [2023, 2024, 2025]) {
    for (let month = 1; month <= 12; month++) {
      const orderCount = Math.floor(Math.random() * 8) + 3; // 3-10 orders / tháng

      for (let i = 0; i < orderCount; i++) {
        const price = [249000, 399000, 599000][Math.floor(Math.random() * 3)];

        fakeOrders.push({
          orderId: new mongoose.Types.ObjectId().toString(), // random id
          userId: new mongoose.Types.ObjectId(),             // fake user
          packageId: new mongoose.Types.ObjectId(),          // fake package
          pricePaid: price,
          status: "success",
          isActive: true,
          startDate: new Date(year, month - 1, 1),
          endDate: new Date(year, month - 1, 28),
          createdAt: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1),
          updatedAt: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1),
        });
      }
    }
  }

  await PaymentOrder.insertMany(fakeOrders);
  console.log(`✅ Seeded ${fakeOrders.length} fake PaymentOrders`);
};

//Create admin if not exist
export const createAdminIfNotExist = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin@', 10);
      const admin = new User({
        fullname: 'Super Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        phone: '0123456789',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('Admin mặc định đã được tạo: admin@admin.com / admin@');
    } else {
      console.log('Admin đã tồn tại, không cần tạo lại.');
    }
  } catch (err) {
    console.error('Lỗi khi tạo admin mặc định:', err);
  }
};

//Auto seed packages if not exist
export const seedPackages = async () => {
  const packages = [
    {
      name: "Basic",
      durationMonths: 1,
      originalPrice: 199000,
      discountedPrice: 99000,
      description: "Truy cập cơ bản, giới hạn flashcard và tính năng. Phù hợp cho người mới bắt đầu.",
      type: "basic",
    },
    {
      name: "Advanced",
      durationMonths: 6,
      originalPrice: 599000,
      discountedPrice: 399000,
      description: "Toàn bộ bài học và luyện tập nâng cao. Tạo tối đa 500 flashcard, phù hợp người học trung cấp.",
      type: "advanced",
    },
    {
      name: "Premium",
      durationMonths: 12,
      originalPrice: 999000,
      discountedPrice: 699000,
      description: "Truy cập không giới hạn tất cả tính năng, ưu tiên VIP, tạo tối đa 1000 flashcard. Dành cho học chuyên sâu.",
      type: "premium",
    },
  ];

  for (const pkg of packages) {
    const exists = await VipPackage.findOne({ type: pkg.type });
    if (!exists) await VipPackage.create(pkg);
  }
};

export const seedLessons = async () => {
  const count = await Lesson.countDocuments();
  if (count > 0) {
    console.log("📚 Lessons already exist, skipping seeding...");
    return;
  }

  const lessons = [
    {
      title: "Lesson 1: Basic Greetings",
      content: "Learn basic English greetings like 'Hello', 'Good morning', 'How are you?'. Practice by greeting your classmates.",
      type: "vocabulary",
      views: 120,
      accessLevel: "free",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 2: Daily Conversations",
      content: "Short dialogue between two friends: \nA: How was your weekend?\nB: It was great! I went to the park.\nPractice saying these sentences aloud.",
      type: "reading",
      views: 95,
      accessLevel: "basic",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 3: Numbers and Dates",
      content: "Learn numbers 1-20 and how to say dates in English. Example: 'Today is September 30th, 2025.'",
      type: "vocabulary",
      views: 80,
      accessLevel: "basic",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 4: Asking for Directions",
      content: "Practice phrases: 'Excuse me, where is the bus stop?' and 'Can you tell me how to get to the museum?'.",
      type: "reading",
      views: 140,
      accessLevel: "advanced",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 5: Food and Drinks",
      content: "Vocabulary: apple, banana, sandwich, coffee, tea. Example sentence: 'I would like a cup of coffee, please.'",
      type: "vocabulary",
      views: 200,
      accessLevel: "advanced",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 6: Shopping Phrases",
      content: "Learn useful phrases: 'How much is this?', 'Do you accept credit cards?', 'Can I try this on?'.",
      type: "reading",
      views: 175,
      accessLevel: "premium",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 7: Talking About Hobbies",
      content: "Practice sentences: 'I enjoy reading books.', 'My favorite hobby is swimming.', 'Do you like playing chess?'.",
      type: "vocabulary",
      views: 160,
      accessLevel: "premium",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 8: Simple Present Tense",
      content: "Understand usage: 'I go to school every day.', 'She plays the piano on Sundays.' Practice writing your own sentences.",
      type: "reading",
      views: 145,
      accessLevel: "basic",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 9: Family Members",
      content: "Vocabulary: father, mother, brother, sister, uncle, aunt. Example: 'My mother is a teacher.'",
      type: "vocabulary",
      views: 130,
      accessLevel: "free",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 10: Telling Time",
      content: "Learn how to tell time: 'It's 3 o'clock.', 'It's half past 7.', 'It's quarter to 5.' Practice with your daily schedule.",
      type: "reading",
      views: 110,
      accessLevel: "basic",
      createdBy: null,
      isDeleted: false,
    },
  ];

  await Lesson.insertMany(lessons);
  console.log("✅ Seeded 10 realistic English lessons successfully!");
};
