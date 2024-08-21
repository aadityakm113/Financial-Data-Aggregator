import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinancialDataTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Fetch financial data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/financial-data?page=${page}&limit=${limit}`);
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchData();
  }, [page, limit]);

  // Ensure data is defined before using map
  const dataToDisplay = data || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Financial Data</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Step</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Age</th>
            <th className="py-2 px-4 border-b">Gender</th>
            <th className="py-2 px-4 border-b">Zipcode</th>
            <th className="py-2 px-4 border-b">Merchant</th>
            <th className="py-2 px-4 border-b">Zip Merchant</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Fraud</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.length === 0 ? (
            <tr>
              <td colSpan="10" className="py-4 text-center">No data available</td>
            </tr>
          ) : (
            dataToDisplay.map(item => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b">{item.step}</td>
                <td className="py-2 px-4 border-b">{item.customer}</td>
                <td className="py-2 px-4 border-b">{item.age}</td>
                <td className="py-2 px-4 border-b">{item.gender}</td>
                <td className="py-2 px-4 border-b">{item.zipcodeOri}</td>
                <td className="py-2 px-4 border-b">{item.merchant}</td>
                <td className="py-2 px-4 border-b">{item.zipMerchant}</td>
                <td className="py-2 px-4 border-b">{item.category}</td>
                <td className="py-2 px-4 border-b">{item.amount}</td>
                <td className="py-2 px-4 border-b">{item.fraud}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FinancialDataTable;
