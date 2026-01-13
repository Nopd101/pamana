import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    activeSections: 0, 
    classAverage: 0 
  });
  const [chartData, setChartData] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ top: [], bottom: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('teacher/progress/');
        const { sections, students } = response.data;
        
        // --- 1. BASIC STATS ---
        const totalStudentsCount = students.length;
        const activeSectionsCount = sections.length;
        const validStudents = students.filter(s => s.average !== "N/A");
        const totalAverageSum = validStudents.reduce((sum, s) => sum + parseFloat(s.average), 0);
        const overallAvg = validStudents.length > 0 ? Math.round(totalAverageSum / validStudents.length) : 0;

        setStats({
            totalStudents: totalStudentsCount,
            activeSections: activeSectionsCount,
            classAverage: overallAvg
        });

        // --- 2. CALCULATE CIVILIZATION PROFICIENCY (CHART DATA) ---
        const civStats = {}; // { "Egypt": { sum: 250, count: 3 } }

        students.forEach(student => {
            if (student.activities) {
                student.activities.forEach(act => {
                    const civ = act.civilization || "General";
                    // Calculate percentage for this specific activity
                    const percent = act.max_score > 0 ? (act.score / act.max_score) * 100 : 0;

                    if (!civStats[civ]) {
                        civStats[civ] = { sum: 0, count: 0 };
                    }
                    civStats[civ].sum += percent;
                    civStats[civ].count += 1;
                });
            }
        });

        const processedChartData = Object.keys(civStats).map(civ => ({
            name: civ,
            score: Math.round(civStats[civ].sum / civStats[civ].count)
        }));

        setChartData(processedChartData);

        // --- 3. CALCULATE LEADERBOARD ---
        // Sort students by average (Descending)
        const sortedStudents = [...validStudents].sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

        setLeaderboard({
            top: sortedStudents.slice(0, 5), // Top 5
            bottom: sortedStudents.slice(-5).reverse() // Bottom 5 (Reversed to show lowest first)
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
      
      {/* STAT CARDS */}
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

      {/* CHARTS & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: BAR CHART (Spans 2 columns) */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#52392F]/10 lg:col-span-2">
            <h2 className="text-xl font-bold text-[#52392F] mb-6">Civilization Proficiency</h2>
            
            <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                unit="%" 
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={50}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score >= 75 ? '#15803d' : entry.score >= 50 ? '#d97706' : '#b91c1c'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 italic">
                        No activity data available to chart.
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT: LEADERBOARD LIST (Spans 1 column) */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-[#52392F]/10 flex flex-col gap-6">
            
            {/* Top Performers */}
            <div>
                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="bg-green-100 p-1 rounded">🏆</span> Top Performers
                </h3>
                <div className="space-y-3">
                    {leaderboard.top.length === 0 ? <p className="text-xs text-gray-400">No data</p> : 
                        leaderboard.top.map((s) => (
                            <div key={s.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                                <span className="font-medium text-gray-700 truncate max-w-[150px]">{s.name}</span>
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">{s.average}%</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Needs Attention */}
            <div>
                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="bg-red-100 p-1 rounded">⚠️</span> Needs Attention
                </h3>
                <div className="space-y-3">
                     {leaderboard.bottom.length === 0 ? <p className="text-xs text-gray-400">No data</p> : 
                        leaderboard.bottom.map((s) => (
                            <div key={s.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                                <span className="font-medium text-gray-700 truncate max-w-[150px]">{s.name}</span>
                                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs">{s.average}%</span>
                            </div>
                        ))
                    }
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;