import './App.css';
import CustomerMenu from './CustomerMenu.js'
import EmployeeView from './EmployeeView.js';
import PaymentView from './PaymentView.js'
import Redirect from './Redirect.js'
import TransactionView from './TransactionView.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'

// Controller
function App() {
  /* Allows for communication between employee and customer view... NOT REAL TIME! */
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => { setIsOpen(!isOpen) }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <CustomerMenu
            isOpen={isOpen}
          />
        } />
        <Route path="/pay" element={ <PaymentView/> } />
        <Route path="/transaction-history" element={ <TransactionView/> } />
        <Route path="/employee" element={
          <EmployeeView
            isOpen={isOpen}
            toggleOpen={toggleOpen}
          />
        } />
        <Route path="*" element={ <Redirect/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
