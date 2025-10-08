import React from "react";
import ExamCard from "./component/ExamCard";
import IcArrow from "../../assets/icons/IcArrow";
import { Link } from "react-router-dom";
import { toeicTest } from "../../data/toeicMockData";
import Hero from "./component/Hero";
import Features from "./component/Features";
import Testimonials from "./component/Testimonials";
import LearningPath from "./component/LearningPath";
export interface Exam {
  id: number;
  title: string;
  image: string;
  questions: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const Home = ({ setIsOpen }) => {
  const examData = [toeicTest];
  return (
    <div className="">
      {/* Hero Section */}
      <Hero/>
      <Features/>
      <LearningPath/>
      <Testimonials/>
    </div>
  );
};

export default Home;
