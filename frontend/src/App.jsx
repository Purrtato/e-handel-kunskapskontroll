import { Routes, Route } from 'react-router-dom'
import ProductList from './pages/ProductList'
import AdminProducts from './pages/AdminProducts'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/admin/products" element={<AdminProducts />} />
    </Routes>
  )
}

export default App