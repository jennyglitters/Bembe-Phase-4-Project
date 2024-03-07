import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import ReservationForm from './ReservationForm';
import LocationHours from './Location&Hours';
import ReservationManagement from './ReservationManagement';
import '../index.css';
import { UserProvider } from './UserContext'; 
import { MenuContext } from './MenuContext'; // Import MenuContext

function App() {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <UserProvider>
      <BrowserRouter>
        <MenuContext.Provider value={{ selectedItems, setSelectedItems }}> {/* Pass selectedItems and setSelectedItems to MenuContext */}
          <div className="App">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} /> 
              <Route path="/create-reservation" element={<ReservationForm />} />
              <Route path="/update-reservation/:reservationId" element={<ReservationForm />} />
              <Route path="/reservations" element={<ReservationForm />} /> 
              <Route path="/location-hours" element={<LocationHours />} />
              <Route path="/manage-reservation" element={<ReservationManagement />} />
            </Routes>
          </div>
        </MenuContext.Provider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;