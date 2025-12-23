import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Nav.jsx';
import AdminNav from './components/AdminNav.jsx';

// --- IMPORTS ---
import Home from './views/MainHomePage.jsx';      // Landing Page
import HomePage from './views/HomePage.jsx';      // Student Dashboard
import About from './views/AboutUsPage.jsx';
import Contact from './views/ContactUsPage.jsx';
import Login from './views/LoginPage.jsx'; 
import SignUp from './views/SignUpPage.jsx';
import KabihasnanDetails from './views/KabihasnanDetails.jsx';

import AdminDashboard from './views/admin/AdminDashboard.jsx';
import UserManagement from './views/admin/UserManagement.jsx';

// --- LAYOUTS ---

// 1. Layout for Public Pages (Has Top Navbar)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24"> {/* Optional: Adds padding so content isn't hidden behind fixed Nav */}
        <Outlet />
      </div>
    </>
  );
};

// 2. Layout for Auth Pages (No Navbar, Centered Content if needed)
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* === GROUP 1: STANDALONE PAGES (No Navbar) === */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* === GROUP 2: PUBLIC PAGES (With Navbar) === */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/kabihasnan/:id" element={<KabihasnanDetails />} />
          </Route>

          {/* === GROUP 3: ADMIN PAGES (With Sidebar) === */}
          <Route path="/admin" element={<AdminNav />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;