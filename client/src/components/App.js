import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar'; // Adjusted
import Home from './Home'; // Adjusted
import Menu from './Menu'; // Adjusted
import ReservationForm from './ReservationForm'; // Adjusted
import LocationHours from './Location&Hours'; // Adjusted
import ReservationManagement from './ReservationManagement'; // Adjusted
import '../index.css' // This is correct

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservation" element={<ReservationForm />} />
          <Route path="/location-hours" element={<LocationHours />} />
          <Route path="/manage-reservation" element={<ReservationManagement />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;