import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

function ProductList() {
  // Listan med alla produkter, hämtade från backend
  const [products, setProducts] = useState([])

  // Hämtar addToCart-funktionen från den delade varukorgen via Context
  const { addToCart } = useCart()

  // Körs en gång när sidan laddas, hämtar produkterna direkt
  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Produkter</h1>

      {/* 2 kolumner på mobil, 4 kolumner på större skärmar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-3">
            <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.price} kr</p>

            {/* Lägger till produkt i varukorgen via Context */}
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 w-full"
            >
              Lägg i varukorg
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList