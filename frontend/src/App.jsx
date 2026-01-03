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
import SaanAkoNabibilang from "./views/SaanAkoNabibilang.jsx";
import FourPicsOneWord from "./views/FourPicsOneWord.jsx";
import GameOfElimination from "./views/GameOfElimination.jsx";
import ArtifactHiddenObject from "./views/ArtifactHiddenObject.jsx";
import HarapPuzzleQuest from "./views/HarapPuzzleQuest.jsx";
import AdminDashboard from "./views/admin/AdminDashboard.jsx";
import UserManagement from "./views/admin/UserManagement.jsx";
import ItamaMoAko from "./views/ItamaMoAko.jsx";

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
        <Route path="/saan-ako-nabibilang" element={<SaanAkoNabibilang />} />
        <Route path="/four-pics-one-word" element={<FourPicsOneWord />} />
        <Route path="/game-of-elimination" element={<GameOfElimination />} />
        <Route path="/artifact-hidden-object" element={<ArtifactHiddenObject />} />
        <Route path="/harappuzzle-quest" element={<HarapPuzzleQuest />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
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
