import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Menu from './components/Menu';
import ReservationForm from './components/ReservationForm';
import LocationHours from './components/Location&Hours';
import Login from './components/Login';
import ReservationManagement from './components/ReservationManagement';
import './index.css';

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
          <Route path="/login" element={<Login />} />
          <Route path="/manage-reservation" element={<ReservationManagement />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;