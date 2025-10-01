import { useEffect, useState } from "react";
import { getTestDetail } from "../service/testService";

export const useTestData = (slug) => {
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const data = await getTestDetail(slug); //slug
                setTestData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchTestData();
        }
    }, [slug]);

    return { testData, loading, error };
}