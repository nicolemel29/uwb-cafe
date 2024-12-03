import './App.css';
import CustomerMenu from './CustomerMenu.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Controller
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <CustomerMenu/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
