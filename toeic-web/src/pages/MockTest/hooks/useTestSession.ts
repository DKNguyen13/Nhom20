import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question, Session } from "../interface/interfaces";
import { getSession, getSessionQuestions, getSessionResults, submitBulkAnswers, submitSession } from "../../../service/sessionService";

export const useTestSession = () => {
  const sessionId = localStorage.getItem("toeic-session-id");
  const navigate = useNavigate();

  const [session, setSession] = useState<Session| null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [unsentAnswers, setUnsentAnswers] = useState<{questionId: string; selectedAnswer: string | null; timeSpent?: number; isFlagged?: boolean}[]>([]);
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [parts, setParts] = useState<number[]>([]);

  // mapping ans
  const indexToLetter = ["A", "B", "C", "D"];
  const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sessionId) return;

        const sessionData = await getSession(sessionId);
        setSession(sessionData.session);

        const questionsData = await getSessionQuestions(sessionId);
        const qs: Question[] = questionsData.questions || [];
        setQuestions(qs);

        const allParts = Array.from(new Set(qs.map((q) => q.partNumber))).sort(
          (a, b) => a - b
        );
        setParts(allParts);
        setCurrentPart(allParts[0] || 1);

        setAnswers(new Array(qs.length).fill(null));
      } catch (err) {
        console.error("Error fetching session or questions:", err);
      }
    };

    fetchData();
  }, [sessionId]);

  const handleAnswer = (indexInPart: number, answerIndex: number) => {
    const questionsInPart = questions.filter(
      (q) => q.partNumber === currentPart
    );

    const question = questionsInPart[indexInPart];

    // cập nhật đáp án
    const updatedAnswers = [...answers];
    updatedAnswers[question.globalQuestionNumber - 1] = answerIndex;
    setAnswers(updatedAnswers);

    // Lưu tạm answers để submit khi chuyển part tiếp theo
    setUnsentAnswers(prev => [
      ...prev.filter(ans => ans.questionId !== question._id),
      {
        questionId: question._id,
        selectedAnswer: indexToLetter[answerIndex],
        timeSpent: 0,
        isFlagged : false
      }
    ]);

    // nếu còn câu trong part hiện tại thì chuyển tiếp
    if (indexInPart + 1 < questionsInPart.length) {
      setCurrentQuestion(indexInPart + 1);
    }
  };

  // Chuyển sang part kế tiếp
  const handleNextPart = async () => {
    const nextPartIndex = parts.indexOf(currentPart) + 1;
    if (nextPartIndex < parts.length) {
      setCurrentPart(parts[nextPartIndex]);
      setCurrentQuestion(0);

      // Goi API submit cau tra loi
      const questionsInCurrentPart = questions.filter(q => q.partNumber === currentPart);
      const answersToSubmit = unsentAnswers.filter(ans => questionsInCurrentPart.some(q => q._id === ans.questionId));

      if(answersToSubmit.length) {
        try {
          await submitBulkAnswers(sessionId, answersToSubmit);
          // delete cac cau da gui trong unsentAnswers
          setUnsentAnswers(prev => prev.filter(ans => !answersToSubmit.some(s => s.questionId === ans.questionId)))
        } catch (error) {
          console.error("Error submitting bulk answers:", error);
        }
      }

      // Scroll lên đầu part mới
      setTimeout(() => {
        const firstQuestion = questions.find(
          (q) => q.partNumber === parts[nextPartIndex]
        );
        if (firstQuestion) {
          const element = document.getElementById(
            `question-${firstQuestion.globalQuestionNumber}`
          );
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleNavigateQuestion = (indexInPart: number) => {
    const questionsInPart = questions.filter((q) => q.partNumber === currentPart);
    setCurrentQuestion(indexInPart);
    const element = document.getElementById(
      `question-${questionsInPart[indexInPart].globalQuestionNumber}`
    );
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleGoBack = () => navigate(-1);

  const questionsInPart = questions
  .filter((q) => q.partNumber === currentPart)
  .map((q) => {
    const isSimplePart = [1, 2].includes(q.partNumber);
    return {
      ...q,
      displayContent: isSimplePart ? null : q.content?.question,
      displayImage: q.content?.image,
      displayChoices: q.choices.map((c) => ({
        ...c,
        displayText: isSimplePart ? c.label : `${c.label}. ${c.text}`
      }))
    };
  });

  const handleSubmitSession = async () => {
    try {
      if(unsentAnswers.length) {
        await submitBulkAnswers(sessionId, unsentAnswers);
        setUnsentAnswers([]);
      }

      const result = await submitSession(sessionId!);
      console.log("Session submitted:", result);

      // redirect sang trang result
      navigate(`/session/${sessionId}/results`);
      const resultResponse = await getSessionResults(sessionId);
      console.log(resultResponse);
    } catch (error) {
      
    }
  };

  return {
    session,
    questions,
    answers,
    currentPart,
    currentQuestion,
    parts,
    questionsInPart,
    handleAnswer,
    handleNextPart,
    handleNavigateQuestion,
    handleGoBack,
    setCurrentPart,
    setCurrentQuestion,
    handleSubmitSession
  };
};

export const useResult = () => {
  const sessionId = localStorage.getItem("toeic-session-id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [resultData, setResultData] = useState<any>(null);
  const [listeningScore, setListeningScore] = useState<number | 0>(0);
  const [readingScore, setReadingScore] = useState<number | 0>(0);
  const [testTitle, setTestTitle] = useState<string>("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getSessionResults(sessionId);

        const session = res.session;
        const results = session?.results;

        if (results) {
          setResultData(results);
          setListeningScore(results.listeningScore ?? 0);
          setReadingScore(results.readingScore ?? 0);
          setTestTitle(session?.test?.title ?? "Unknown Test");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResult();
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, [sessionId]);

  return {
    loading,
    error,
    resultData,
    listeningScore,
    readingScore,
    testTitle,
  };
};