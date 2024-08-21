import React, { useState } from 'react';
import DataTable from '../charts/DataTable';
import MerchantBarChart from '../charts/MerchantBarChart';
import MerchantsPerCategoryBarChart from '../charts/MerchantsPerCategoryBarChart';
import PieChart from '../charts/PieChart';
import FilterComponent from './Filter'; // Import the FilterComponent

const Dashboard = ({ onLogout }) => {
  const [filters, setFilters] = useState({});

  const handleLogout = () => {
    fetch('/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        onLogout();
        // Remove navigation to login page
      })
      .catch((err) => console.error('Error during logout:', err));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Sign Out
      </button>
      <FilterComponent onFilterChange={handleFilterChange} />
      <DataTable filters={filters} />
      <MerchantBarChart filters={filters} />
      <MerchantsPerCategoryBarChart filters={filters} />
      <PieChart filters={filters} />
    </div>
  );
};

export default Dashboard;
