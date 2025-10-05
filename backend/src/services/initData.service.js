import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Lesson from "../models/lesson.model.js";
import VipPackage from "../models/vipPackage.model.js";
import PaymentOrder from "../models/paymentOrder.model.js";
import ScoreMapping from "../models/scoreMapping.model.js";
import { estimateScore } from "../services/score.service.js";


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
      originalPrice: 299000,
      discountedPrice: 249000,
      description: "Truy cập cơ bản, giới hạn tính năng và bài học.",
      type: "basic",
    },
    {
      name: "Pro",
      durationMonths: 6,
      originalPrice: 499000,
      discountedPrice: 399000,
      description: "Truy cập toàn bộ bài học, luyện tập nâng cao.",
      type: "pro",
    },
    {
      name: "Premium",
      durationMonths: 12,
      originalPrice: 799000,
      discountedPrice: 599000,
      description: "Truy cập không giới hạn, hỗ trợ đầy đủ, ưu tiên VIP.",
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
      accessLevel: "pro",
      createdBy: null,
      isDeleted: false,
    },
    {
      title: "Lesson 5: Food and Drinks",
      content: "Vocabulary: apple, banana, sandwich, coffee, tea. Example sentence: 'I would like a cup of coffee, please.'",
      type: "vocabulary",
      views: 200,
      accessLevel: "pro",
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

export const seedScoreMappings = async () => {
  const mappings = [];

  const listeningMapping = [
    { correctAnswers: 0, scaledScore: 5 },
    { correctAnswers: 10, scaledScore: 55 },
    { correctAnswers: 20, scaledScore: 110 },
    { correctAnswers: 30, scaledScore: 170 },
    { correctAnswers: 40, scaledScore: 230 },
    { correctAnswers: 50, scaledScore: 285 },
    { correctAnswers: 60, scaledScore: 345 },
    { correctAnswers: 70, scaledScore: 400 },
    { correctAnswers: 80, scaledScore: 455 },
    { correctAnswers: 90, scaledScore: 485 },
    { correctAnswers: 100, scaledScore: 495 },
  ];

  const readingMapping = [
    { correctAnswers: 0, scaledScore: 5 },
    { correctAnswers: 10, scaledScore: 60 },
    { correctAnswers: 20, scaledScore: 120 },
    { correctAnswers: 30, scaledScore: 175 },
    { correctAnswers: 40, scaledScore: 230 },
    { correctAnswers: 50, scaledScore: 285 },
    { correctAnswers: 60, scaledScore: 340 },
    { correctAnswers: 70, scaledScore: 390 },
    { correctAnswers: 80, scaledScore: 440 },
    { correctAnswers: 90, scaledScore: 480 },
    { correctAnswers: 100, scaledScore: 495 },
  ];

  // Create mappings for both sections
  for (const mapping of listeningMapping) {
    mappings.push({
      section: 'listening',
      correctAnswers: mapping.correctAnswers,
      scaledScore: mapping.scaledScore,
      version: 'estimated-v1',
      source: 'Custom',
      isActive: true,
      effectiveFrom: new Date(),
      createdBy: null // System generated
    });
  }

  for (const mapping of readingMapping) {
    mappings.push({
      section: 'reading',
      correctAnswers: mapping.correctAnswers,
      scaledScore: mapping.scaledScore,
      version: 'estimated-v1',
      source: 'Custom',
      isActive: true,
      effectiveFrom: new Date(),
      createdBy: null // System generated
    });
  }

  // Fill in intermediate values
  for (let section of ['listening', 'reading']) {
    const sectionMappings = mappings.filter(m => m.section === section);

    for (let i = 0; i < 100; i++) {
      if (!sectionMappings.find(m => m.correctAnswers === i)) {
        // Interpolate score
        const score = estimateScore(section, i);
        mappings.push({
          section,
          correctAnswers: i,
          scaledScore: score,
          version: 'estimated-v1',
          source: 'Custom',
          isActive: true,
          effectiveFrom: new Date(),
          createdBy: null
        });
      }
    }
  }

  try {
    await ScoreMapping.deleteMany({}); // clear old data
    await ScoreMapping.insertMany(mappings);
    console.log('Score mappings seeded successfully!');
  } catch (err) {
    console.error('Error seeding score mappings:', err);
  } finally {
    mongoose.connection.close();
  }
};
