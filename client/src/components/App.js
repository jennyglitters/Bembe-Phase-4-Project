import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import LocationHours from './Location&Hours';
import Menu from './Menu';
import NavBar from './NavBar';
import ReservationForm from './ReservationForm';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservationform" element={<ReservationForm />} />
          <Route path="/locationandhours" element={<LocationHours />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
