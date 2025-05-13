import Link from 'next/link';

export default function ProductCard({ product }) {
  // Use product.img if available, otherwise fallback to Unsplash
  const img = product.img || `https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80`;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-0 flex flex-col items-stretch border-t-4 border-blue-200 hover:shadow-2xl transition group relative overflow-hidden">
      <div className="relative">
        <img src={img} alt={product.name} className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform" />
        <span className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow">{product.category}</span>
        <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">₹{product.price}</span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-blue-900 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{product.description}</p>
        <Link href={`/products/${product.id}`} legacyBehavior>
          <a className="mt-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-full shadow hover:bg-blue-700 transition text-sm flex items-center gap-2 self-start">View Details <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </Link>
      </div>
      {/* Decorative shape */}
      <svg className="absolute -right-8 -bottom-8 w-24 h-24 text-blue-50 opacity-80" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
    </div>
  );
}
