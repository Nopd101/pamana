import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import TsinoWordHunt from "./views/TsinoWordHunt";
import SaanAkoNabibilang from "./views/SaanAkoNabibilang";
import PostTest from "./views/PostTest";
import ItamaMoAko from "./views/ItamaMoAko";
import AdminNav from './components/AdminNav.jsx';
import AdminDashboard from './views/admin/AdminDashboard.jsx';
import UserManagement from './views/admin/UserManagement.jsx';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/kabihasnan/:id" element={<KabihasnanDetails />} />
        <Route path="/caste-game" element={<CasteGame />} />
        <Route path="/mindflip-game" element={<MindFlipGame />} />
        <Route path="/riddle-game" element={<RiddleGame />} />
        <Route path="/wordhunt-game" element={<WordHuntGame />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<TermsAndAgreementPage />} />
        <Route path="/itama-mo-ako" element={<ItamaMoAko />} />
        <Route path="/terms-and-agreement" element={<TermsAndAgreementPage />} />
        <Route path="/tsino-word-hunt" element={<TsinoWordHunt />} />
        <Route path="/saan-ako-nabibilang" element={<SaanAkoNabibilang />} />
        <Route path="/post-test" element={<PostTest />} />
        <Route path="/admin" element={<AdminNav />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
