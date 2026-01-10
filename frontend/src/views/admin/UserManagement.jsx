import React, { useState, useEffect } from 'react';
import API from '../../api/axios'; // Import your axios instance

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [sectionsList, setSectionsList] = useState([]); // To populate section dropdown
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null = mode create
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "", // Employee/Student ID
    password: "",
    role: "student",
    section: "", // ID of the section
    is_active: true
  });

  // Fetch Initial Data
  useEffect(() => {
    fetchUsers();
    fetchSections();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get('admin/users/');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
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
      role: "teacher", // Default to teacher as requested
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
        password: "", // Leave blank to keep unchanged
        role: user.role,
        section: user.section || "",
        is_active: user.is_active
    });
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeactivate = async (id) => {
    if (window.confirm("Are you sure you want to DEACTIVATE this user? They will no longer be able to log in.")) {
      try {
        // We still call delete(), but the backend now handles it as a soft delete
        await API.delete(`admin/users/${id}/`);
        fetchUsers(); // Refresh list to see status change
      } catch (error) {
        alert("Failed to deactivate user.");
      }
    }
  };

  const handleReactivate = async (id) => {
    if (window.confirm("Are you sure you want to REACTIVATE this user?")) {
      try {
        // Send a PATCH request to specifically set is_active to true
        await API.patch(`admin/users/${id}/`, { is_active: true });
        fetchUsers(); // Refresh the list
        alert("User reactivated successfully.");
      } catch (error) {
        console.error("Reactivation failed:", error);
        alert("Failed to reactivate user.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Prepare payload (remove empty password if editing)
    const payload = { ...formData };
    if (currentUser && !payload.password) {
        delete payload.password;
    }

    try {
        if (currentUser) {
            // Update
            await API.patch(`admin/users/${currentUser.id}/`, payload);
            alert("User updated successfully!");
        } else {
            // Create
            await API.post('admin/users/', payload);
            alert("User created successfully!");
        }
        setIsModalOpen(false);
        fetchUsers();
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
    <div className="min-h-screen bg-[#FFF3D1] p-6 font-[var(--font-body)]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#52392F]">User Management</h1>
        </div>
        <button onClick={handleAddNew} className="bg-[#52392F] text-white px-6 py-2.5 rounded-lg hover:bg-[#772402] transition shadow-md font-medium flex items-center gap-2">
          <span>+</span> Add Teacher / Student
        </button>
      </div>

      {/* TABLE */}
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
            {loading ? (
                <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
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
                    {/* Display Section Name (Assuming backend sends section_name or ID mapping needed) */}
                    {/* Since basic User serializer sends ID, we might see ID here. Ideally update serializer to send name or map it here */}
                    {sectionsList.find(s => s.id === user.section)?.name || "-"}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(user)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                    {user.is_active ? (
                      <button 
                        onClick={() => handleDeactivate(user.id)} 
                        className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition"
                        title="Deactivate Account"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReactivate(user.id)} 
                        className="text-green-600 hover:bg-green-50 px-2 py-1 rounded transition font-bold"
                        title="Reactivate Account"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-[#52392F] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {currentUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl">×</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
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
                        <option value="admin">Admin</option>
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#52392F] text-white rounded hover:bg-[#772402]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;