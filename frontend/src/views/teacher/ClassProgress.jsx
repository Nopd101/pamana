import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const ClassProgress = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ sections: [], students: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  
  // 👇 1. NEW STATE FOR SORTING
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get('teacher/progress/');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load progress data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredStudents = data.students.filter(student => {
    const matchesSection = selectedSection === "all" || student.section_id === parseInt(selectedSection);
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  // --- SORTING LOGIC ---
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sort active

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle "N/A" for average scores (treat as -1 so they go to bottom)
    if (sortConfig.key === 'average') {
        aValue = aValue === 'N/A' ? -1 : parseFloat(aValue);
        bValue = bValue === 'N/A' ? -1 : parseFloat(bValue);
    }

    if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handler to toggle sort direction
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper to render sort arrows
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <span className="text-white/40 ml-1">⇅</span>;
    return sortConfig.direction === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  return (
    <div className="min-h-screen font-[var(--font-body)] p-6">
      <h1 className="text-3xl font-bold text-[#52392F] font-[var(--font-heading)] mb-8">
        Class Progress Report
      </h1>

      {/* FILTERS */}
      <div className="bg-white/50 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 border border-[#52392F]/10">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search student name..." 
            className="w-full pl-10 pr-4 py-3 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
        
        {/* Section Dropdown */}
        <div className="w-full md:w-64">
            <select 
            className="w-full px-4 py-3 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white text-[#52392F] cursor-pointer"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            >
            <option value="all">All Sections</option>
            {data.sections.map(section => (
                <option key={section.id} value={section.id}>
                {section.name}
                </option>
            ))}
            </select>
        </div>
      </div>

      {/* --- SCROLLABLE TABLE CONTAINER --- */}
      {/* 1. Added max-h for scrolling */}
      {/* 2. Added flex-col to maintain structure */}
      <div className="bg-white rounded-xl shadow-md border border-[#52392F]/10 flex flex-col">
        <div className="overflow-auto max-h-[720px] rounded-xl">
          <table className="w-full text-left border-collapse">
            
            {/* Sticky Header */}
            <thead className="bg-[#52392F] text-white uppercase text-xs font-bold tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 bg-[#52392F]">Student Name</th>
                <th className="p-4 hidden md:table-cell bg-[#52392F]">Section</th>
                
                {/* SORTABLE HEADER: Quiz(s) Completed */}
                <th 
                    className="p-4 text-center cursor-pointer hover:bg-[#772402] transition bg-[#52392F]"
                    onClick={() => requestSort('activities_done')}
                >
                    <div className="flex items-center justify-center">
                        Completion Progress {getSortIcon('activities_done')}
                    </div>
                </th>

                {/* SORTABLE HEADER: Avg. Performance */}
                <th 
                    className="p-4 text-center cursor-pointer hover:bg-[#772402] transition bg-[#52392F]"
                    onClick={() => requestSort('average')}
                >
                    <div className="flex items-center justify-center">
                        Avg. Performance {getSortIcon('average')}
                    </div>
                </th>

                <th className="p-4 text-right bg-[#52392F]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading data...</td></tr>
              ) : sortedStudents.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No students found.</td></tr>
              ) : (
                sortedStudents.map((student) => {
                  const avg = student.average; 
                  
                  return (
                    <tr key={student.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                      <td className="p-4 font-bold text-black">{student.name}</td>
                      <td className="p-4 text-black hidden md:table-cell">{student.section}</td>
                      <td className="p-4 text-center text-gray-600 font-medium">{student.activities_done}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${
                          avg === "N/A" ? "bg-gray-100 text-gray-600" :
                          avg >= 75 ? 'bg-green-100 text-green-800' : 
                          avg >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {avg === "N/A" ? "N/A" : `${avg}%`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => navigate(`/teacher/report/${student.id}`, { state: { student } })}
                          className="text-[#772402] hover:bg-[#772402] hover:text-white border border-[#772402] px-3 py-1 rounded-md transition text-xs font-bold uppercase cursor-pointer"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassProgress;