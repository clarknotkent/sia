import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', sales: 12500, orders: 8, deliveries: 5 },
  { day: 'Tue', sales: 15300, orders: 11, deliveries: 7 },
  { day: 'Wed', sales: 9800, orders: 6, deliveries: 6 },
  { day: 'Thu', sales: 11200, orders: 9, deliveries: 8 },
  { day: 'Fri', sales: 16800, orders: 12, deliveries: 9 },
  { day: 'Sat', sales: 21000, orders: 15, deliveries: 13 },
  { day: 'Sun', sales: 19400, orders: 13, deliveries: 10 },
];

const DashboardChart = () => {
  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-300 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" tickFormatter={(val) => `₱${val / 1000}k`} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={(value, name) =>
            name === 'Sales' ? `₱${value.toLocaleString()}` : `${value}`} />
          <Legend />
          <Bar yAxisId="left" dataKey="sales" name="Sales" fill="#3b82f6" />
          <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#f59e0b" />
          <Bar yAxisId="right" dataKey="deliveries" name="Deliveries" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
