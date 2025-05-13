import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';

const categories = [
  { name: 'All', count: 10 },
  { name: 'Apps', count: 2 },
  { name: 'E-Books', count: 3 },
  { name: 'Assessment Tools', count: 2 },
  { name: 'Workshops', count: 2 },
  { name: 'Webinars', count: 1 },
];
const products = [
  { id: 1, name: 'Learning App', description: 'Interactive app for special education', price: 499, category: 'Apps', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'E-Book: Inclusive Teaching', description: 'Guide for teachers and parents', price: 299, category: 'E-Books', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Assessment Toolkit', description: 'Tools for child assessment', price: 799, category: 'Assessment Tools', img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Parenting Guide', description: 'E-book for parents', price: 199, category: 'E-Books', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Speech Therapy Workshop', description: 'Live workshop for speech therapy techniques', price: 650, category: 'Workshops', img: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Autism Support Webinar', description: 'Webinar for parents and teachers', price: 350, category: 'Webinars', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 7, name: 'Behavior Assessment Kit', description: 'Comprehensive kit for behavior assessment', price: 899, category: 'Assessment Tools', img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'Digital Learning App', description: 'App for digital learning and progress tracking', price: 599, category: 'Apps', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { id: 9, name: 'Mindfulness E-Book', description: 'E-book for mindfulness and well-being', price: 249, category: 'E-Books', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { id: 10, name: 'Parent-Teacher Workshop', description: 'Workshop for effective parent-teacher collaboration', price: 700, category: 'Workshops', img: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80' },
];

export default function ProductsPage() {
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState([0, 1000]);
  const filtered = products.filter(p =>
    (selected === 'All' || p.category === selected) &&
    (p.price >= price[0] && p.price <= price[1]) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <>
      <Navbar />
      {/* Hero/Intro Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-16 md:py-20 overflow-hidden mb-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <span className="inline-block bg-blue-100 text-blue-600 font-bold px-4 py-1 rounded-full mb-4">Our Products</span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-blue-900 leading-tight">Explore Our Learning Products</h1>
          <p className="mb-8 text-gray-700 text-lg max-w-2xl">Discover a curated selection of apps, e-books, and assessment tools designed to empower learners, parents, and educators. Filter by category, price, or search for what you need.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 mb-8 md:mb-0 md:sticky top-28 h-fit bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
          <form onSubmit={e => e.preventDefault()} className="space-y-8">
            {/* Search */}
            <div>
              <label className="block font-bold text-blue-900 mb-2">Find By Categories</label>
              <div className="flex items-center gap-2">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full px-4 py-2 rounded-full border border-blue-200 focus:ring-2 focus:ring-blue-400 text-sm" />
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition" aria-label="Search"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" /></svg></button>
              </div>
            </div>
            {/* Price Range */}
            <div>
              <div className="font-bold text-xl text-blue-900 mb-2 border-l-4 border-blue-600 pl-2">Filter by Price</div>
              <div className="flex items-center gap-2 mb-2">
                <input type="range" min={0} max={1000} value={price[0]} onChange={e => setPrice([+e.target.value, price[1]])} className="w-1/2 accent-blue-600" />
                <input type="range" min={0} max={1000} value={price[1]} onChange={e => setPrice([price[0], +e.target.value])} className="w-1/2 accent-blue-600" />
              </div>
              <div className="flex items-center justify-between mb-2 text-black font-semibold">
                <span>₹{price[0]}</span>
                <span>₹{price[1]}</span>
              </div>
              <button className="w-full bg-blue-600 text-white font-bold rounded-full py-2 hover:bg-blue-700 transition">Filter</button>
            </div>
            {/* Category */}
            <div>
              <div className="font-bold text-xl text-blue-900 mb-2 border-l-4 border-blue-600 pl-2">Category</div>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.name} className="flex items-center gap-2">
                    <input type="radio" id={cat.name} name="category" checked={selected === cat.name} onChange={() => setSelected(cat.name)} className="accent-blue-600" />
                    <label htmlFor={cat.name} className="text-gray-800 cursor-pointer flex-1">{cat.name} <span className="text-gray-400 font-semibold">({cat.count})</span></label>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        </aside>
        {/* Products Grid */}
        <main className="flex-1">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-16 text-lg">No products found for your filters.</div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
