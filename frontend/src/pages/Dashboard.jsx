import React, { useState } from 'react';
import DataTable from '../charts/DataTable';
import MerchantBarChart from '../charts/MerchantBarChart';
import PieChart from '../charts/PieChart';
import Filter from './Filter'; // Import the FilterComponent
import BarChart from '../charts/BarChart';
import FraudByCategoryChart from '../charts/FraudCategory';
import FraudCountBox from '../charts/FraudCountBox';

const Dashboard = ({ onLogout }) => {
  const [filters, setFilters] = useState({});

  const handleLogout = () => {
    fetch('/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        onLogout();
        // Redirect to login page handled by routing
      })
      .catch((err) => console.error('Error during logout:', err));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the FinDagg Dashboard!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </header>

      {/* <Filter onFilterChange={handleFilterChange} /> */}

      <section className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <DataTable filters={filters} />
        </div>
      </section>

      <section className="space-y-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <BarChart filters={filters} className="w-full h-[600px]" /> {/* Increased height for BarChart */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <MerchantBarChart filters={filters} className="w-full h-[600px]" /> {/* Increased height for MerchantBarChart */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <PieChart filters={filters} className="w-full h-[500px]" /> {/* Adjust height for PieChart if needed */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
