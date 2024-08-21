import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FraudCategoryChart = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/financial-data/fraud-by-category');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Try to parse JSON response
        const result = await response.json();
        setData(result);
      } catch (error) {
        // If error is related to non-JSON content, handle it gracefully
        if (error.message.includes('Unexpected token')) {
          setError('Received invalid JSON from server');
        } else {
          setError(error.message);
        }
        console.error('Error fetching fraud data by category:', error);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Ensure data has the expected structure
  if (!Array.isArray(data)) {
    return <div>Error: Data format is incorrect</div>;
  }

  const categories = data.map(item => item._id);
  const amounts = data.map(item => item.totalAmount);
  const counts = data.map(item => item.fraudCount);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Total Fraud Amount',
        data: amounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Number of Fraud Accounts',
        data: counts,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default FraudCategoryChart;
