import React from 'react';

const metrics = [
  {
    label: 'Sales Today',
    value: '₱12,500',
    sub: new Date().toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
  {
    label: 'Orders Today',
    value: '14',
    sub: 'Confirmed Orders',
  },
  {
    label: 'Deliveries',
    value: '5',
    sub: 'Completed Today',
  },
  {
    label: 'Low Stock Items',
    value: '3',
    sub: 'Needs Restock',
  },
];

const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded shadow-md p-4 border border-gray-200 text-center"
        >
          <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
          <div className="text-sm font-semibold text-gray-600">{metric.label}</div>
          <div className="text-xs text-gray-400 mt-1">{metric.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
