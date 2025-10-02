import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question, Session } from "../interface/interfaces";
import { getSession, getSessionQuestions } from "../../../service/sessionService";

export const useTestSession = () => {
  const sessionId = localStorage.getItem("toeic-session-id");
  const navigate = useNavigate();

  const [session, setSession] = useState<Session| null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [parts, setParts] = useState<number[]>([]);

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

    // nếu còn câu trong part hiện tại thì chuyển tiếp
    if (indexInPart + 1 < questionsInPart.length) {
      setCurrentQuestion(indexInPart + 1);
    }
  };

  // Chuyển sang part kế tiếp
  const handleNextPart = () => {
    const nextPartIndex = parts.indexOf(currentPart) + 1;
    if (nextPartIndex < parts.length) {
      setCurrentPart(parts[nextPartIndex]);
      setCurrentQuestion(0);

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
  };
}