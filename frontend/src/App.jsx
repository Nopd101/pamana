import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav.jsx';
import Home from './views/MainHomePage.jsx';
import About from './views/AboutUsPage.jsx';
import Contact from './views/ContactUsPage.jsx';
import HomePage from './views/HomePage.jsx';
import KabihasnanDetails from './views/KabihasnanDetails.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/kabihasnan/:id" element={<KabihasnanDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;