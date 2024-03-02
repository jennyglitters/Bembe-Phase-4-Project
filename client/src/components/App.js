import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Menu from './components/Menu';
import ReservationForm from './components/ReservationForm';
import LocationHours from './components/Location&Hours';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservationform" element={<ReservationForm />} />
          <Route path="/location&hours" element={<LocationHours />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

