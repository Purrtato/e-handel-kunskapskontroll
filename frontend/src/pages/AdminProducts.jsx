import { useState, useEffect } from 'react'

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
    fetch('http://localhost:3000/products')
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
      ? `http://localhost:3000/products/${editingId}`
      : 'http://localhost:3000/products'
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

    fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
      .then(() => fetchProducts()) // Hämta uppdaterad lista (produkten är nu is_active=false)
      .catch(err => console.error(err))
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - Produkter</h1>

      {/* Formuläret, samma fält används för både "skapa" och "redigera" */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8 max-w-md">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Namn" className="border p-2 rounded w-full" required />
        <input name="description" value={formData.description} onChange={handleChange} placeholder="Beskrivning" className="border p-2 rounded w-full" />
        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Pris" className="border p-2 rounded w-full" required />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Kategori" className="border p-2 rounded w-full" />
        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Lagerantal" className="border p-2 rounded w-full" />
        <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Bild-URL" className="border p-2 rounded w-full" />

        <div className="flex gap-2">
          {/* Knapptexten ändras beroende på om vi skapar eller redigerar */}
          <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
            {editingId ? 'Spara ändringar' : 'Skapa produkt'}
          </button>
          {/* Avbryt-knappen visas bara när man faktiskt redigerar något */}
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Avbryt
            </button>
          )}
        </div>
      </form>

      {/* Listar alla produkter, en rad per produkt */}
      <ul className="space-y-2">
        {products.map(product => (
          // Key krävs av React för att hålla koll på varje rad unikt
          <li key={product.id} className="border p-3 rounded-lg flex justify-between items-center">
            <span>{product.name} - {product.price} kr</span>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline">
                Redigera
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                Ta bort
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminProducts