import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Nav.jsx';
import Home from './views/MainHomePage.jsx';
import About from './views/AboutUsPage.jsx';
import Contact from './views/ContactUsPage.jsx';
import Login from './views/LoginPage.jsx'; 
import SignUp from './views/SignUpPage.jsx';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;