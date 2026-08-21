import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar() {
  // Hämtar varukorgen för att kunna visa antal varor i menyn
  const { cart } = useCart()

  // Räknar ihop totalt antal varor
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="flex gap-4 p-4 border-b mb-4">
      <Link to="/" className="hover:underline">Produkter</Link>
      <Link to="/cart" className="hover:underline">
        Varukorg {itemCount > 0 && `(${itemCount})`}
      </Link>
      <Link to="/admin/products" className="hover:underline">Admin</Link>
    </nav>
  )
}

export default Navbar