import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import { ProductDetail } from './views/ProductDetail';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}

export default App
