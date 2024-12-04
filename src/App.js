import './App.css';
import CustomerMenu from './CustomerMenu.js'
import CustomerLogin from './CustomerLogin.js'
import EmployeeView from './EmployeeView.js';
import PaymentView from './PaymentView.js'
import Redirect from './Redirect.js'
import TransactionView from './TransactionView.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import EmployeeLogin from './EmployeeLogin.js';

// Controller
function App() {
  /* Allows for communication between employee and customer view... NOT REAL TIME! */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customer-login" element={
          <CustomerLogin/>
        } />
        <Route path="/menu" element={
          <CustomerMenu/>
        } />
        <Route path="/pay" element={ <PaymentView/> } />
        <Route path="/transaction-history" element={ <TransactionView/> } />
        <Route path="/employee-login" element={ <EmployeeLogin/> } />
        <Route path="/employee" element={
          <EmployeeView/>
        } />
        <Route path="*" element={ <Redirect/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
