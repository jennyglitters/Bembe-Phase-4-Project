import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Route, not Routes
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
        <Routes> {/* Use Routes if you're using React Router v6 */}
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
