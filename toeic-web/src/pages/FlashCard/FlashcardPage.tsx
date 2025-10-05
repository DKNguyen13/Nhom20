import React from "react";
import FlashcardList from "./components/FlashcardList";

const FlashcardPage: React.FC = () => {
  return (
    <div className="min-h-screen">

      {/* Panel header */}
      <div className="w-full bg-gradient-to-r from-[#F5E6E8] via-[#D6EAF8] to-[#D6EAF8] shadow-lg py-6 px-8 flex items-center justify-between">
        <div className="flex items-center">
          <i className="far fa-clone text-4xl mr-4 text-white"></i>
          <span className="text-3xl font-extrabold text-black">📚 Flashcards</span>
        </div>
        <button className="text-lg font-medium bg-white text-blue-700 px-6 py-3 rounded-full hover:bg-blue-100 transition">
          Khám phá
        </button>
      </div>

      {/* Flashcard list */}
      <div className="mt-10 px-8">
        <FlashcardList />
      </div>
    </div>
  );
};

export default FlashcardPage;