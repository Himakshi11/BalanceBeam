import React, { useMemo } from 'react'
import CustomPieChart from '../../components/Charts/CustomPieChart'

const COLORS = [
  "#8B5CF6",
  "#06B6D4", 
  "#F97316",
  "#EC4899",
  "#10B981", 
  "#F59E0B",
  "#3B82F6",
];

const RecentIncomeWithChart = ({ data, totalIncome }) => {

  const chartData = useMemo(() => {
  const grouped = {};

  data?.forEach((item) => {
    if (grouped[item.source]) {
      grouped[item.source] += Number(item.amount); // sum duplicates
    } else {
      grouped[item.source] = Number(item.amount);
    }
  });

  return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
}, [data]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Last 60 Days Income</h5>
      </div>
      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`₹${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
      
    </div>
  )
}

export default RecentIncomeWithChart