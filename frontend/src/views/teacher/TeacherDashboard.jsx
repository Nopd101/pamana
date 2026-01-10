import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, activeSections: 0, classAverage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 SWITCH TO THE NEW ENDPOINT
        // This returns { sections: [...], students: [...] }
        const response = await API.get('teacher/progress/');
        const { sections, students } = response.data;
        
        // 1. Total Students
        const totalStudentsCount = students.length;

        // 2. Active Sections (Count the sections array directly)
        const activeSectionsCount = sections.length;

        // 3. Calculate Class Average
        // Filter out students with "N/A" average
        const validStudents = students.filter(s => s.average !== "N/A");
        
        // Sum up the averages
        const totalAverageSum = validStudents.reduce((sum, s) => sum + parseFloat(s.average), 0);
        
        // Calculate mean
        const overallAvg = validStudents.length > 0 
            ? Math.round(totalAverageSum / validStudents.length) 
            : 0;

        setStats({
            totalStudents: totalStudentsCount,
            activeSections: activeSectionsCount,
            classAverage: overallAvg
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
    <div className="min-h-screen p-6 font-[var(--font-body)]">
      <h1 className="text-3xl font-bold text-[#52392F] mb-8 font-[var(--font-heading)]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F]">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
          <p className="text-4xl font-bold text-[#52392F] mt-2">{loading ? "..." : stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-600">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Sections</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{loading ? "..." : stats.activeSections}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-amber-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Class Average</h3>
          <p className="text-4xl font-bold text-amber-600 mt-2">{loading ? "..." : `${stats.classAverage}%`}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#52392F]/10">
        <h2 className="text-xl font-bold text-[#52392F] mb-4">Class Performance</h2>
        <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-gray-600">
                Welcome, Teacher! You are currently managing <strong>{loading ? "..." : stats.activeSections}</strong> section(s).
                Check the Class Progress tab for detailed reports.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;