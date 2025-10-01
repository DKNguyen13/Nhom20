import { useEffect, useState } from "react";
import { getTestDetail } from "../service/testService";
import { useNavigate } from "react-router-dom";
import { startSession } from "../service/sessionService";

export const useTestSession = (testData) => {

  const navigate = useNavigate();
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState(null);

  const handleStartPractice = async (mode = "practice") => {
    if (!testData) return;

    const payload = {
      testId: testData.data.test._id,
      sessionType: mode === "fulltest" ? "full-test" : "practice",
      selectedParts: mode === "fulltest" ? [1, 2, 3, 4, 5, 6, 7] : Array.from(selectedParts),
      timeLimit: mode === "fulltest" ? 120 : selectedTime > 0 ? selectedTime : null,
    };

    setSessionLoading(true);
    setSessionError(null);

    try {
      const session = await startSession(payload);
      navigate(`/session/${session.id}`);
    } catch (err) {
      setSessionError(err.message || "Failed to start session");
    } finally {
      setSessionLoading(false);
    }
  };

  return {
    selectedParts,
    setSelectedParts,
    selectedTime,
    setSelectedTime,
    handleStartPractice,
    sessionLoading,
    sessionError,
  };
}

