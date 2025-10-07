import React from "react";
import Result from "./Result";
import { useResult } from "../hooks/useTestSession";

const ResultPage: React.FC = () => {
  const { loading, error, resultData, listeningScore, readingScore, testTitle } = useResult();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resultData) return <p className="text-center">No result found</p>;

  return (
    <Result
    testTitle= {testTitle}
      totalQuestions={resultData.totalQuestions}
      correctAnswers={resultData.correctCount}
      wrongAnswers={resultData.incorrectCount}
      skippedQuestions={resultData.skippedCount}
      totalScore={resultData.totalScore}
      listeningScore = {listeningScore}
      readingScore = {readingScore}
    />
  );
};

export default ResultPage;
