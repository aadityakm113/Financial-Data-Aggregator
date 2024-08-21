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
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Sign Out
      </button>
      
      <Filter onFilterChange={handleFilterChange} />
      <DataTable filters={filters} />
      <FraudCountBox/>
      <BarChart filters={filters}/>
      <MerchantBarChart filters={filters} />
      <FraudByCategoryChart filters={filters}/>
      <PieChart filters={filters} />
    </div>
  );
};

export default Dashboard;
