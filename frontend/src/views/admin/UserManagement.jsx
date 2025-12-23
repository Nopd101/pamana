import React, { useState } from 'react';

const UserManagement = () => {
  // 1. Mock Data (Expanded to demonstrate pagination)
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Dela Cruz", role: "Student", section: "Grade 10 - Rizal", status: "Active" },
    { id: 2, name: "Maria Clara", role: "Teacher", section: "Grade 10 - Rizal, Grade 10 - Bonifacio", status: "Active" },
    { id: 3, name: "Crisostomo Ibarra", role: "Student", section: "Grade 10 - Bonifacio", status: "Inactive" },
    { id: 4, name: "Padre Damaso", role: "Teacher", section: "Grade 10 - Aguinaldo", status: "Active" },
    { id: 5, name: "Elias", role: "Student", section: "Grade 10 - Rizal", status: "Active" },
    { id: 6, name: "Pilosopo Tasyo", role: "Teacher", section: "Grade 10 - Luna", status: "Inactive" },
    { id: 7, name: "Sisa", role: "Student", section: "Grade 10 - Luna", status: "Active" },
    { id: 8, name: "Basilio", role: "Student", section: "Grade 10 - Luna", status: "Active" },
    { id: 9, name: "Kapitan Tiago", role: "Teacher", section: "Grade 10 - Mabini", status: "Active" },
    { id: 10, name: "Doña Victorina", role: "Teacher", section: "Grade 10 - Mabini", status: "Active" },
    { id: 11, name: "Simoun", role: "Student", section: "Grade 10 - Luna", status: "Active" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 2. Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 4. Handlers
  const handleAddNew = () => {
    setCurrentUser({ id: null, name: "", role: "Student", section: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      setUsers(users.map(u => u.id === id ? { ...u, status: "Inactive" } : u));
    }
  };

  const handleResetPassword = (name) => {
    alert(`Password reset link sent to ${name}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: currentUser.id || Date.now(),
      name: formData.get("name"),
      role: formData.get("role"),
      section: formData.get("section"),
      status: formData.get("status"),
    };

    if (currentUser.id) {
      setUsers(users.map(u => u.id === currentUser.id ? newUser : u));
    } else {
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  return (
    // Updated Background Color to #FFF3D1
    <div className="min-h-screen bg-[#FFF3D1] p-6 font-[var(--font-body)]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#52392F]">User Management ==AI==</h1>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#52392F] text-white px-6 py-2.5 rounded-lg hover:bg-[#772402] transition shadow-md font-medium flex items-center gap-2"
        >
          <span>+</span> Add New User
        </button>
      </div>

      {/* CONTROLS SECTION (Search & Filter) */}
      <div className="bg-[#FFF3D1] p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search by name" 
            className="w-full pl-10 pr-4 py-2 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        
        <select 
          className="px-4 py-2 border border-[#52392F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52392F] bg-white text-[#52392F]"
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
        >
          <option value="All">All Roles</option>
          <option value="Student">Students</option>
          <option value="Teacher">Teachers</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#52392F]/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#52392F] text-white uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Assigned Section</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#FFF3D1]/50 transition duration-150">
                  <td className="p-4">
                    <div className="font-bold text-black">{user.name}</div>
                  </td>
                  <td className="p-4">
                    {/* REMOVED COLORS: Just plain black text */}
                    <span className="text-black">{user.role}</span>
                  </td>
                  <td className="p-4 text-black font-medium">
                    {user.section || "—"}
                  </td>
                  <td className="p-4">
                    {/* REMOVED COLORS: Just plain black text */}
                    <span className="text-black font-medium">{user.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(user.name)}
                        title="Reset Password"
                        className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition"
                      >
                        🔑
                      </button>
                      <button 
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                        className="p-1.5 text-blue-600 hover:text-black hover:bg-blue-50 rounded-md transition"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        title={user.status === 'Active' ? "Deactivate User" : "Activate User"}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                      >
                        🚫
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* NUMBERED PAGINATION FOOTER */}
        <div className="bg-white p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#52392F]">
          <span>
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-bold">{filteredUsers.length}</span> entries
          </span>
          
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-[#FFF3D1] disabled:opacity-30 disabled:hover:bg-white transition"
            >
              &lt;
            </button>

            {/* Numbered Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 border rounded transition ${
                  currentPage === number 
                    ? "bg-[#52392F] text-white border-[#52392F]" 
                    : "border-gray-300 hover:bg-[#FFF3D1] text-black"
                }`}
              >
                {number}
              </button>
            ))}

            {/* Next Button */}
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-[#FFF3D1] disabled:opacity-30 disabled:hover:bg-white transition"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* EDIT/ADD MODAL (Unchanged logic, kept consistent with style) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-[#52392F] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {currentUser.id ? 'Edit User Details' : 'Create New Account'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl">×</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-black mb-1">Full Name</label>
                  <input name="name" defaultValue={currentUser.name} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52392F] outline-none text-black" placeholder="e.g. Juan Dela Cruz" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Role</label>
                  <select name="role" defaultValue={currentUser.role} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#52392F] outline-none text-black">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Account Status</label>
                  <select name="status" defaultValue={currentUser.status} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-[#52392F] outline-none text-black">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Assigned Section(s)
                </label>
                <input name="section" defaultValue={currentUser.section} placeholder="e.g. Grade 10 - Rizal" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#52392F] outline-none text-black" />
                <p className="text-xs text-gray-500 mt-1">
                  For Teachers, separate multiple sections with commas.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#52392F] text-white font-medium rounded-lg hover:bg-[#772402] shadow-lg transition">
                  {currentUser.id ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;