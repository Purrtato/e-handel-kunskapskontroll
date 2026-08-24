import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { API_URL } from '../config'

function ProductList() {
  // Listan med alla produkter, hämtade från backend
  const [products, setProducts] = useState([])

  // Hämtar addToCart-funktionen från den delade varukorgen via Context
  const { addToCart } = useCart()

  const [currentSlide, setCurrentSlide] = useState(0)

  // Körs en gång när sidan laddas, hämtar produkterna direkt
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

   // Väljer ut de 5 första produkterna som "kampanjprodukter" för slideshowen
  const featured = products.slice(0, 5)

  // Byter slide automatiskt var 4:e sekund
  useEffect(() => {
    if (featured.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featured.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [featured.length])

  return (
    <div className="min-h-screen bg-slate-900 p-6">

       {/* Hero-slideshow */}
      {featured.length > 0 && (
        <div className="relative max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden h-64 md:h-80">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Mörk gradient underst så texten syns tydligt */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-6">
                <div>
                  <p className="text-emerald-400 font-semibold text-sm mb-1">Kampanj</p>
                  <h2 className="text-white text-2xl font-bold">{product.name}</h2>
                  <p className="text-white text-lg">{product.price} kr</p>
                </div>
              </div>
            </div>
          ))}

          {/* Prickar för att visa vilken slide man är på */}
          <div className="absolute bottom-4 right-6 flex gap-2">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-emerald-400' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      
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