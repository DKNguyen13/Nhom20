import Lesson from "../models/lesson.model.js";

export const seedLessons = async () => {
  const count = await Lesson.countDocuments();
  if (count > 0) {
    console.log("Lessons already exist, skipping seeding...");
    return;
  }

  const lessons = [];

  for (let i = 1; i <= 20; i++) {
    lessons.push({
      title: `Sample Lesson ${i}`,
      content: `This is the content of lesson number ${i}.`,
      type: i % 2 === 0 ? "reading" : "vocabulary",
      accessLevel: ["free", "basic", "pro", "premium"][i % 4],
      createdBy: null,
    });
  }

  await Lesson.insertMany(lessons);
  console.log("Seeded 20 lessons successfully!");
};
