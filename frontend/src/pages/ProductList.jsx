import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { API_URL } from '../config'

function ProductList() {
  // Listan med alla produkter, hämtade från backend
  const [products, setProducts] = useState([])

  // Hämtar addToCart-funktionen från den delade varukorgen via Context
  const { addToCart } = useCart()

  // Körs en gång när sidan laddas, hämtar produkterna direkt
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Produkter</h1>

      {/* 2 kolumner på mobil, 4 kolumner på större skärmar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map(product => (
          <div key={product.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-emerald-400 hover:-translate-y-1 transition-all duration-200">
            <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3"/>
            <h2 className="font-semibold text-white">{product.name}</h2>
            <p className="text-emerald-400 font-bold mt-1">{product.price} kr</p>

            {/* Lägger till produkt i varukorgen via Context */}
            <button
              onClick={() => addToCart(product)}
              className="mt-3 bg-emerald-500 text-slate-900 font-semibold px-3 py-2 rounded-lg hover:bg-emerald-400 transition-colors w-full"
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