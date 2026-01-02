import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
