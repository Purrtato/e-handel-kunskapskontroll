import { useState, useEffect } from 'react'

function AdminProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Produkter</h1>
      <ul className="space-y-2">
        {products.map(product => (
          <li key={product.id} className="border p-3 rounded-lg">
            {product.name} - {product.price} kr
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminProducts