import React, { useState } from "react";
import { Flashcard } from "./FlashcardList";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onDelete?: (id: string) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard, onDelete }) => {
  const [flipped, setFlipped] = useState(false);

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(flashcard.word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="w-full h-48 cursor-pointer"
      style={{
        perspective: "1000px",
      }}
      onClick={() => setFlipped(!flipped)}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "center",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}>

        {/* Mặt trước */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
          className="bg-white border shadow-md p-4 rounded-lg flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold text-blue-800">{flashcard.word}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakWord();
            }}
            className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            🔊 Phát âm
          </button>
        </div>

        {/* Mặt sau */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="bg-blue-50 border shadow-md p-4 rounded-lg flex flex-col justify-center items-center">
          <p className="text-gray-800 font-semibold">{flashcard.meaning}</p>
          {flashcard.example && (
            <p className="italic text-gray-600 mt-1">{flashcard.example}</p>
          )}
          {flashcard.note && (
            <p className="text-sm text-gray-500 mt-1">{flashcard.note}</p>
          )}
          {flashcard._id && onDelete && (
          <button onClick={(e) => {
              e.stopPropagation();
              onDelete(flashcard._id!);
            }}
            className="mt-3 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
            Xóa
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;
