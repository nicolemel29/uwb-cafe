import './App.css';
import CustomerMenu from './CustomerMenu.js'
import PaymentView from './PaymentView.js'
import Redirect from './Redirect.js'
import TransactionView from './TransactionView.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Controller
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <CustomerMenu/> } />
        <Route path="/pay" element={ <PaymentView/> } />
        <Route path="/transaction-history" element={ <TransactionView/> } />
        <Route path="*" element={ <Redirect/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
