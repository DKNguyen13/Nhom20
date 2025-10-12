import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionResults, getSessionsUser, submitBulkAnswers, submitSession } from "../../../service/sessionService";
import { useSessionBase } from "./useSessionBase";


export const useTestSession = () => {

  const navigate = useNavigate();
  
  const sessionId = localStorage.getItem("toeic-session-id");

  const base = useSessionBase(sessionId);
  const {
    questions,
    currentPart,
    parts,
    setCurrentPart,
    setCurrentQuestion,
  } = base;

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [unsentAnswers, setUnsentAnswers] = useState<
    { questionId: string; selectedAnswer: string | null }[]
  >([]);

  const indexToLetter = ["A", "B", "C", "D"];

  const handleAnswer = (indexInPart: number, answerIndex: number) => {
    const questionsInPart = questions.filter(
      (q) => q.partNumber === currentPart
    );
    const question = questionsInPart[indexInPart];
    const updatedAnswers = [...answers];
    updatedAnswers[question.globalQuestionNumber - 1] = answerIndex;
    setAnswers(updatedAnswers);

    setUnsentAnswers((prev) => [
      ...prev.filter((ans) => ans.questionId !== question._id),
      {
        questionId: question._id,
        selectedAnswer: indexToLetter[answerIndex],
      },
    ]);
  };

  const handleNextPart = async () => {
    const nextPartIndex = parts.indexOf(currentPart) + 1;
    if (nextPartIndex < parts.length) {
      // submit answers
      const questionsInCurrentPart = questions.filter(
        (q) => q.partNumber === currentPart
      );
      const answersToSubmit = unsentAnswers.filter((ans) =>
        questionsInCurrentPart.some((q) => q._id === ans.questionId)
      );

      if (answersToSubmit.length) {
        await submitBulkAnswers(sessionId!, answersToSubmit);
        setUnsentAnswers((prev) =>
          prev.filter(
            (ans) =>
              !answersToSubmit.some((s) => s.questionId === ans.questionId)
          )
        );
      }

      setCurrentPart(parts[nextPartIndex]);
      setCurrentQuestion(0);
    }
  };

  const handleSubmitSession = async () => {
    if (unsentAnswers.length) {
      await submitBulkAnswers(sessionId!, unsentAnswers);
      setUnsentAnswers([]);
    }
    await submitSession(sessionId!);
    navigate(`/session/${sessionId}/results`);
  };

  return {
    ...base, // thừa kế từ useSessionBase
    answers,
    handleAnswer,
    handleNextPart,
    handleSubmitSession,
  };
};

export const useResult = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getSessionResults(id);

        console.log(res);

        const result = res.session;
        const answers = res.ansers;

        if (result) {
          setResultData(result);
        }
        if(answers) {
          setUserAnswers(answers);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải kết quả");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    } else {
      setError("No session ID found");
      setLoading(false);
    }
  }, [id]);

  return {
    loading,
    error,
    resultData,
    userAnswers
  };
};



export const useSessionsUser = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getSessionsUser();

        console.log("✅ API response:", res);

        const results = res.sessions;
        if(results) {
          setSessions(results);
        }
      } catch (err: any) {
        setError(err || 'Fetch history test fail');
      }
      finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { loading, error, sessions };
};