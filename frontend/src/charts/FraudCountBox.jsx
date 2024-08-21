import React, { useEffect, useState } from 'react';

const FraudCountBox = () => {
  const [totalFrauds, setTotalFrauds] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/financial-data/total-frauds');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setTotalFrauds(result.totalFrauds);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching total frauds:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-sm mx-auto bg-white shadow-md rounded-lg">
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : totalFrauds === null ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Total Number of Frauds</h2>
          <div className="text-2xl font-bold text-gray-800">{totalFrauds}</div>
        </div>
      )}
    </div>
  );
};

export default FraudCountBox;
