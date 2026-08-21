import { Routes, Route } from 'react-router-dom'
import ProductList from './pages/ProductList'
import AdminProducts from './pages/AdminProducts'
import Cart from './pages/Cart'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin/products" element={<AdminProducts />} />
    </Routes>
  )
}

export default App