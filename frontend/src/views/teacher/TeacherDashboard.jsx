import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, activeSections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('teacher-dashboard/');
        // The backend returns a list of students. We can derive stats from that.
        const students = response.data;
        const uniqueSections = [...new Set(students.map(s => s.section))];
        
        setStats({
            totalStudents: students.length,
            activeSections: uniqueSections.length
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#52392F] mb-8 font-[var(--font-heading)]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F]">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
          <p className="text-4xl font-bold text-[#52392F] mt-2">{loading ? "..." : stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-600">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Sections</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{loading ? "..." : stats.activeSections}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-[#52392F] mb-4">Class Performance</h2>
        <p className="text-gray-600">
            Welcome, Teacher! Use the <strong>Class Progress</strong> tab to view detailed scores for your students across all civilizations.
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;