import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  // Hämtar varukorgen för att kunna visa antal varor i menyn
  const { cart } = useCart()

  // Räknar ihop totalt antal varor
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-950 border-b border-slate-800">
      <Link to="/" className="text-xl font-bold text-white tracking-tight">
        Retro<span className="text-emerald-400">Store</span>
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="text-slate-300 hover:text-emerald-400 transition-colors">
          Produkter
        </Link>
      <Link to="/cart" className="text-slate-300 hover:text-emerald-400 transition-colors">
          Varukorg {itemCount > 0 && <span className="text-emerald-400 font-semibold">({itemCount})</span>}
        </Link>
      <Link to="/admin/products" className="text-slate-300 hover:text-emerald-400 transition-colors">
          Admin
        </Link>
      <Link to="/admin/orders" className="text-slate-300 hover:text-emerald-400 transition-colors">
          Ordrar
        </Link>
      </div>
    </nav>
  )
}

export default Navbar