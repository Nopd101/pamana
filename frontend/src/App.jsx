import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Nav.jsx";
import Home from "./views/MainHomePage.jsx";
import About from "./views/AboutUsPage.jsx";
import Contact from "./views/ContactUsPage.jsx";
import Login from "./views/LoginPage.jsx";
import SignUp from "./views/SignUpPage.jsx";
import HomePage from "./views/HomePage.jsx";
import KabihasnanDetails from "./views/KabihasnanDetails.jsx";
import CasteGame from "./views/IndusCasteGame.jsx";
import MindFlipGame from "./views/MesoMemoryGame.jsx";
import RiddleGame from "./views/MesoRiddleGame.jsx";
import WordHuntGame from "./views/TsinoWordHunt.jsx";
import FAQPage from "./views/FAQPage.jsx";
import TermsAndAgreementPage from "./views/TermsAndAgreementPage.jsx";
import SaanAkoNabibilang from "./views/SaanAkoNabibilang.jsx";
import FourPicsOneWord from "./views/FourPicsOneWord.jsx";
import GameOfElimination from "./views/GameOfElimination.jsx";
import ArtifactHiddenObject from "./views/ArtifactHiddenObject.jsx";
import HarapPuzzleQuest from "./views/HarapPuzzleQuest.jsx";
import AdminDashboard from "./views/admin/AdminDashboard.jsx";
import UserManagement from "./views/admin/UserManagement.jsx";
import ItamaMoAko from "./views/ItamaMoAko.jsx";
import TeacherLayout from "./views/teacher/TeacherLayout.jsx";
import TeacherDashboard from "./views/teacher/TeacherDashboard.jsx";
import ClassProgress from "./views/teacher/ClassProgress.jsx";
import AdminNav from "./components/AdminNav.jsx";
import StudentReport from "./views/teacher/StudentReport.jsx";
import ScrollToTop from "./components/ScrollToTop";
import StudentProfile from "./views/StudentProfile.jsx";
import PrivateRoute from "./components/PrivateRoute";
import PostTest from "./views/PostTest.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/teacher');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      
      <ToastContainer position="top-center" style={{ zIndex: 99999 }} limit={1} />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<TermsAndAgreementPage />} />

        {/* --- 🛡️ SHARED LEARNING ROUTES (Accessible by Student AND Teacher for Review) --- */}
        {/* 👇 THIS IS THE FIX: Allow teachers to access content pages for review */}
        <Route element={<PrivateRoute allowedRoles={['student', 'teacher']} />}>
            <Route path="/kabihasnan/:id" element={<KabihasnanDetails />} />
            <Route path="/post-test" element={<PostTest />} />
        </Route>

        {/* --- 🛡️ STUDENT ONLY ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            
            {/* Games - (Teachers typically don't play these directly, but if they need to, move them up) */}
            <Route path="/caste-game" element={<CasteGame />} />
            <Route path="/mindflip-game" element={<MindFlipGame />} />
            <Route path="/riddle-game" element={<RiddleGame />} />
            <Route path="/wordhunt-game" element={<WordHuntGame />} />
            <Route path="/itama-mo-ako" element={<ItamaMoAko />} />
            <Route path="/saan-ako-nabibilang" element={<SaanAkoNabibilang />} />
            <Route path="/four-pics-one-word" element={<FourPicsOneWord />} />
            <Route path="/game-of-elimination" element={<GameOfElimination />} />
            <Route path="/artifact-hidden-object" element={<ArtifactHiddenObject />} />
            <Route path="/harappuzzle-quest" element={<HarapPuzzleQuest />} />
        </Route>

        {/* --- 🛡️ ADMIN ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminNav />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
            </Route>
        </Route>

        {/* --- 🛡️ TEACHER ROUTES --- */}
        <Route element={<PrivateRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher" element={<TeacherLayout />}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="progress" element={<ClassProgress />} />
                <Route path="report/:studentId" element={<StudentReport />} />
            </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
