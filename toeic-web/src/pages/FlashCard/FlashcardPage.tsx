import React from "react";
import FlashcardList from "./components/FlashcardList";

const FlashcardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FlashcardList />
    </div>
  );
};

export default FlashcardPage;
