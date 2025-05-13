import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const cart = [
  { id: 1, name: 'Learning App', description: 'Interactive app for special education', price: 499 },
  { id: 2, name: 'E-Book: Inclusive Teaching', description: 'Guide for teachers and parents', price: 299 },
];

export default function CartPage() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button className="px-6 py-3 bg-green-600 text-white rounded font-bold w-full">Checkout</button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
