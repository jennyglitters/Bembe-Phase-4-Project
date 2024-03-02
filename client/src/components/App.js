import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import MenuItems from './components/MenuItems';
import ModifyReservation from './components/ModifyReservation'; 
import OrderList from './components/OrderList'; 
import ReservationForm from './components/ReservationForm'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/menu" element={<MenuItems />} />
          <Route path="/modify-reservation" element={<ModifyReservation />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/reservation-form" element={<ReservationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
