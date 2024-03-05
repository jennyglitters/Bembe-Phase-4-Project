import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import ReservationForm from './ReservationForm';
import LocationHours from './Location&Hours';
import ReservationManagement from './ReservationManagement';
import '../index.css';
import { UserProvider } from './UserContext'; // Adjust the path as necessary


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<ReservationForm />} /> 
            <Route path="/location-hours" element={<LocationHours />} />
            <Route path="/manage-reservation" element={<ReservationManagement />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}


export default App;