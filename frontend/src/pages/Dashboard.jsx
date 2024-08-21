import React from 'react'
import DataTable from '../charts/DataTable'
import LineChart from '../charts/LineChart'
import MerchantBarChart from '../charts/MerchantBarChart'
import MerchantsPerCategoryBarChart from '../charts/MerchantsPerCategoryBarChart'
import PieChart from '../charts/PieChart'

const Dashboard = () => {
  return (
    <div>
        <DataTable/>
        {/* <LineChart/> */}
        <MerchantBarChart/>
        <MerchantsPerCategoryBarChart/>
        <PieChart/>
    </div>
  )
}

export default Dashboard