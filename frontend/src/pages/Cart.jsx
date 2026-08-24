import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function Cart() {
  // Hämtar varukorgens innehåll och funktionerna från Context
  const { cart, removeFromCart } = useCart()

  // Räknar ut totalsumman genom att summera pris * antal för varje rad
  // reduce "vandrar igenom" hela listan och bygger upp ett enda värde (summan)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Varukorg</h1>

        {cart.length === 0 ? (
          <p className="text-slate-400">Din varukorg är tom.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {/* Vänster kolumn, varorna */}
            <ul className="space-y-3">
              {cart.map(item => (
                <li
                  key={item.id}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center gap-2"
                >
                  <span className="text-white truncate">{item.name} x {item.quantity}</span>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-emerald-400 font-semibold whitespace-nowrap">{item.price * item.quantity} kr</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Ta bort
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Höger kolumn, sammanfattning */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-fit">
              <h2 className="text-lg font-semibold text-white mb-4">Sammanfattning</h2>

              {/* Rabattkod, bara för utseende ingen funktion bakom */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Rabattkod"
                  className="bg-slate-900 border border-slate-700 text-white placeholder-slate-500 p-2 rounded-lg text-sm flex-1 focus:border-emerald-400 focus:outline-none"
                />
                <button className="bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm hover:bg-slate-600 transition-colors">
                  Tillämpa
                </button>
              </div>

              <div className="border-t border-slate-700 pt-3 flex justify-between mb-5">
                <span className="text-white font-semibold">Totalt</span>
                <span className="text-emerald-400 font-bold text-lg">{total} kr</span>
              </div>

              <Link
                to="/checkout"
                className="bg-emerald-500 text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors w-full inline-block text-center"
              >
                Gå till checkout
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart