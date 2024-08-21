import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/financial-data/merchants-per-category');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching fraud data:', error);
      }
    };
    fetchData();
  }, []);

  const categories = data.map(cat => cat._id);
  const frauds = data.map(cat => cat.merchants.reduce((sum, merchant) => sum + merchant.count, 0));

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Number of Frauds per Category',
        data: frauds,
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
