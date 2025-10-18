import React, { useEffect, useState } from "react";
import Navigation from "./component/Navigation";
import api from "../../config/axios";
import TestCard from "./component/TestCard";

export const MockTest = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/test`);
        if(!response){
          setError('Không có đề thi nào');
        }
        setTests(response.data.data.tests || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-12">
        <div>Loading tests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mt-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <section className="flex justify-center mt-12 flex-col items-center">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-12 mb-12 max-w-[1000px] justify-center items-center">
            {tests.map((item, index) => (
              <TestCard
                key={index}
                slug={item.slug}
                title={item.title}
                questions={200}
                time={120}
                attempts={item.statistics?.totalAttempts || 0}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
