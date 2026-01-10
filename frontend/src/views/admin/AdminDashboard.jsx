import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const AdminDashboard = () => {
  // --- DASHBOARD STATS STATE ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalSections: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // --- USER MANAGEMENT STATE ---
  const [users, setUsers] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role: "student",
    section: "",
    is_active: true
  });

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    action: null
  });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchSections();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('admin/stats/');
      setStats(response.data);
      setStatsLoading(false);
    } catch (error) {
      console.error("Failed to fetch stats", error);
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('admin/users/');
      setUsers(response.data);
      setUsersLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsersLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await API.get('sections/');
      setSectionsList(response.data);
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  // --- HANDLERS ---

  const handleAddNew = () => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      role: "teacher", 
      section: "",
      is_active: true
    });
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: "", 
        role: user.role,
        section: user.section || "",
        is_active: user.is_active
    });
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const requestDeactivate = (id) => {
    setConfirmConfig({
      title: "Confirm Deactivation",
      message: "Are you sure you want to DEACTIVATE this user? They will no longer be able to log in.",
      action: () => performDeactivate(id)
    });
    setShowConfirmModal(true);
  };

  const performDeactivate = async (id) => {
    try {
      await API.delete(`admin/users/${id}/`);
      fetchUsers();
      fetchStats(); // Refresh stats too
      setShowConfirmModal(false);
    } catch (error) {
      alert("Failed to deactivate user.");
    }
  };

  const requestReactivate = (id) => {
    setConfirmConfig({
      title: "Confirm Reactivation",
      message: "Are you sure you want to REACTIVATE this user account?",
      action: () => performReactivate(id)
    });
    setShowConfirmModal(true);
  };

  const performReactivate = async (id) => {
    try {
      await API.patch(`admin/users/${id}/`, { is_active: true });
      fetchUsers();
      fetchStats(); // Refresh stats too
      setShowConfirmModal(false);
    } catch (error) {
      alert("Failed to reactivate user.");
    }
  };

  const handleSaveAttempt = (e) => {
    e.preventDefault();
    setConfirmConfig({
      title: currentUser ? "Confirm Update" : "Confirm Creation",
      message: currentUser 
        ? "Are you sure you want to update this user's details?" 
        : "Are you sure you want to create this new user?",
      action: performSave
    });
    setShowConfirmModal(true);
  };

  const performSave = async () => {
    const payload = { ...formData };
    if (currentUser && !payload.password) {
        delete payload.password;
    }

    try {
        if (currentUser) {
            await API.patch(`admin/users/${currentUser.id}/`, payload);
        } else {
            await API.post('admin/users/', payload);
        }
        setIsModalOpen(false);
        setShowConfirmModal(false);
        fetchUsers();
        fetchStats(); // Refresh stats
    } catch (error) {
        console.error("Save error:", error.response?.data);
        alert("Failed to save. Check console for details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen p-6 font-[var(--font-body)]">
      <h1 className="text-3xl font-bold text-[#52392F] mb-8 font-[var(--font-heading)]">Dashboard Overview</h1>
      
      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#52392F]">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
          <p className="text-4xl font-bold text-[#52392F] mt-2">{statsLoading ? "..." : stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-green-600">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Users</h3>
          <p className="text-4xl font-bold text-green-700 mt-2">{statsLoading ? "..." : stats.activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Inactive Users</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{statsLoading ? "..." : stats.inactiveUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-amber-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Sections</h3>
          <p className="text-4xl font-bold text-amber-600 mt-2">{statsLoading ? "..." : stats.totalSections}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#52392F]/10 mb-10">
        <h2 className="text-xl font-bold text-[#52392F] mb-4">System Status</h2>
        <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-gray-600">All systems are running smoothly. Database connection is stable.</p>
        </div>
      </div>

      {/* --- USER MANAGEMENT SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#52392F]">User Management</h1>
        </div>
        <button onClick={handleAddNew} className="bg-[#52392F] text-white px-6 py-2.5 rounded-lg hover:bg-[#772402] transition shadow-md font-medium flex items-center gap-2 cursor-pointer">
          <span>+</span> Add Teacher / Student
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#52392F]/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#52392F] text-white uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Username (ID)</th>
              <th className="p-4">Role</th>
              <th className="p-4">Section</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {usersLoading ? (
                <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
            ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                  <td className="p-4 font-bold text-black">{user.first_name} {user.last_name}</td>
                  <td className="p-4 text-gray-600">{user.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-black font-medium">
                    {sectionsList.find(s => s.id === user.section)?.name || "-"}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(user)} className="mr-3 text-blue-600 hover:underline cursor-pointer">Edit</button>
                    {user.role !== 'admin' && (
                      user.is_active ? (
                        <button onClick={() => requestDeactivate(user.id)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition cursor-pointer" title="Deactivate Account">
                          Deactivate
                        </button>
                      ) : (
                        <button onClick={() => requestReactivate(user.id)} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded transition font-bold cursor-pointer" title="Reactivate Account">
                          Reactivate
                        </button>
                      )
                    )}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALS (Create/Edit & Confirm) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-[#52392F] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {currentUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleSaveAttempt} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">First Name</label>
                    <input name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Last Name</label>
                    <input name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full border rounded p-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Username / ID</label>
                <input name="username" value={formData.username} onChange={handleInputChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    className="w-full border rounded p-2" 
                    placeholder={currentUser ? "Leave blank to keep current password" : "Required for new users"}
                    required={!currentUser} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border rounded p-2">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        {currentUser?.role === 'admin' && (
                            <option value="admin">Admin</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Section</label>
                    <select name="section" value={formData.section} onChange={handleInputChange} className="w-full border rounded p-2">
                        <option value="">-- None --</option>
                        {sectionsList.map(sec => (
                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                        ))}
                    </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#52392F] text-white rounded hover:bg-[#772402] cursor-pointer">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="text-center bg-[#FDFBF7]/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-[#C8AA86]/50 max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4 text-[#5a2d0c] font-[var(--font-heading)]">
              {confirmConfig.title}
            </h2>
            <p className="text-lg mb-8 text-[#5a2d0c]">
              {confirmConfig.message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmConfig.action}
                className="bg-[#772402] text-white py-3 px-8 rounded-lg shadow-lg hover:bg-[#5a3b26] transition-colors font-bold text-lg cursor-pointer"
              >
                Yes, Proceed
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="border-2 border-[#772402] text-[#772402] py-3 px-8 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;