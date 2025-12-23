import React from 'react';

const AdminDashboard = () => {
  // Mock Data
  const stats = {
    totalUsers: 150,
    activeUsers: 142,
    inactiveUsers: 8,
    totalSections: 12
  };

  return (
    <div>
      <h1 className="text-3xl font-[var(--font-heading)] font-bold text-[#52392F] mb-8">Dashboard Overview ===AI===</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F]">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
          <p className="text-4xl font-bold text-[#52392F] mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-600">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Users</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{stats.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Inactive Users</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.inactiveUsers}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-[#52392F] mb-4">System Status</h2>
        <p className="text-gray-600">All systems are running smoothly. Database connection is stable.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;