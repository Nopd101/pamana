import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalSections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('admin/stats/');
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-6 font-[var(--font-body)]">
      <h1 className="text-3xl font-bold text-[#52392F] mb-8 font-[var(--font-heading)]">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F]">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
          <p className="text-4xl font-bold text-[#52392F] mt-2">{loading ? "..." : stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-600">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Users</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{loading ? "..." : stats.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Inactive Users</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{loading ? "..." : stats.inactiveUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-amber-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Sections</h3>
          <p className="text-4xl font-bold text-amber-600 mt-2">{loading ? "..." : stats.totalSections}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#52392F]/10">
        <h2 className="text-xl font-bold text-[#52392F] mb-4">System Status</h2>
        <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-gray-600">All systems are running smoothly. Database connection is stable.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;