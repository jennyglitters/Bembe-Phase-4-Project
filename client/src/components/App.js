import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Menu from './Menu';
import ReservationForm from './ReservationForm';
import LocationHours from './Location&Hours';
import ReservationManagement from './ReservationManagement';
import '../index.css';
import { UserProvider } from './UserContext'; // Adjust the path as necessary
import { MenuContext } from './MenuContext'; // Import MenuContext

function App() {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <UserProvider>
      <BrowserRouter>
        <MenuContext.Provider value={{ selectedItems, setSelectedItems }}> {/* Wrap routes with MenuContext.Provider */}
          <div className="App">
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} /> {/* Remove setSelectedItems prop */}
              <Route path="/reservations" element={<ReservationForm />} /> {/* Remove selectedItems prop */}
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