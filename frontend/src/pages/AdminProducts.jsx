import { useState, useEffect } from 'react'
import { API_URL } from '../config'

function AdminProducts() {
  // Listan med alla produkter, hämtade från backend
  const [products, setProducts] = useState([])

  // Håller värdena i formuläret just nu
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', image_url: ''
  })

  // Vi skapar en ny produkt
  const [editingId, setEditingId] = useState(null)

  // Körs en gång när komponenten laddas första gången
  // Hämtar produktlistan direkt när admin-sidan öppnas
  useEffect(() => {
    fetchProducts()
  }, [])

  // Hämtar alla produkter från backend och sparar dem i "products"-state
  function fetchProducts() {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }

  // Körs varje gång man skriver i ett input-fält
  // e.target.name = vilket fält som ändrades (t.ex. "price")
  // e.target.value = det nya värdet man skrev in
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // ...formData kopierar alla befintliga fält
  }

  // Nollställer formuläret och avslutar ev. redigeringsläge
  function resetForm() {
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' })
    setEditingId(null)
  }

  // Körs när man trycker "Skapa produkt" / "Spara ändringar"
  function handleSubmit(e) {
    e.preventDefault() // stoppar sidan från att ladda om

    // Väljer URL och metod beroende på om vi skapar (POST) eller redigerar (PUT)
    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`
    const method = editingId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // Gör om formData-objektet till en JSON-sträng
    })
      .then(res => res.json())
      .then(() => {
        resetForm()       // Töm formuläret
        fetchProducts()   // Hämta uppdaterad lista, så ändringen syns direkt
      })
      .catch(err => console.error(err))
  }

  // Körs när man klickar "Redigera" på en produkt
  // Fyller formuläret med produktens nuvarande värden
  function handleEdit(product) {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url
    })
    setEditingId(product.id) // "Kom ihåg" vilken produkt vi redigerar
  }

  // Körs när man klickar "Ta bort"
  function handleDelete(id) {
    if (!confirm('Ta bort produkten?')) return // Avbryt om man klickar "Avbryt" i rutan

    fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts()) // Hämta uppdaterad lista (produkten är nu is_active=false)
      .catch(err => console.error(err))
  }

    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Admin - Produkter</h1>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Vänster kolumn, formuläret */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? 'Redigera produkt' : 'Ny produkt'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Namn"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                  required
                />
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Beskrivning"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                />
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Pris"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                  required
                />
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Kategori"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                />
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Lagerantal"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                />
                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="Bild-URL"
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 p-3 rounded-lg w-full focus:border-emerald-400 focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-emerald-500 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    {editingId ? 'Spara ändringar' : 'Skapa produkt'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Avbryt
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Höger kolumn, produktlistan */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Alla produkter</h2>
              <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {products.map(product => (
                  <li
                    key={product.id}
                    className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex justify-between items-center gap-2"
                  >
                    <span className="text-white truncate">{product.name} - {product.price} kr</span>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                      >
                        Redigera
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Ta bort
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

        </div>
      </div>
    </div>
  )
}

export default AdminProducts