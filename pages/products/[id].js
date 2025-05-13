import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Learning App',
    description: 'Interactive app for special education',
    price: 499,
    category: 'Apps',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
    author: 'Dr. Asha Mehta',
    rating: 4.8,
    reviews: 32,
    features: ['20 Lessons', 'English', 'Beginner', '9 Weeks', '3.7k Students', 'Certification'],
    instructor: 'Dr. Asha Mehta',
    phone: '(201) 555-0124',
    oldPrice: 599,
    discount: 17,
    curriculum: ['Introduction', 'Getting Started', 'Interactive Activities', 'Progress Tracking'],
    overview: 'Unlock your child’s potential with our interactive Learning App, designed for special education. This app offers engaging activities, progress tracking, and resources for parents and educators.'
  },
  {
    id: 2,
    name: 'E-Book: Inclusive Teaching',
    description: 'Guide for teachers and parents',
    price: 299,
    category: 'E-Books',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    author: 'Ms. Priya Sharma',
    rating: 4.6,
    reviews: 18,
    features: ['PDF Format', 'English', 'All Levels', 'Instant Download', 'Certification'],
    instructor: 'Ms. Priya Sharma',
    phone: '(201) 555-0124',
    oldPrice: 399,
    discount: 25,
    curriculum: ['Inclusive Education Basics', 'Strategies', 'Case Studies'],
    overview: 'A comprehensive guide for teachers and parents to foster inclusive classrooms and support every learner.'
  },
  {
    id: 3,
    name: 'Assessment Toolkit',
    description: 'Tools for child assessment',
    price: 799,
    category: 'Assessment Tools',
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    author: 'Mr. Rajiv Kumar',
    rating: 4.7,
    reviews: 21,
    features: ['15 Tools', 'English', 'All Levels', 'Lifetime Access', 'Certification'],
    instructor: 'Mr. Rajiv Kumar',
    phone: '(201) 555-0125',
    oldPrice: 899,
    discount: 12,
    curriculum: ['Assessment Basics', 'Tool Usage', 'Reporting'],
    overview: 'A comprehensive toolkit for child assessment, including guides and templates for educators and parents.'
  },
  {
    id: 4,
    name: 'Parenting Guide',
    description: 'E-book for parents',
    price: 199,
    category: 'E-Books',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    author: 'Dr. Sunita Rao',
    rating: 4.5,
    reviews: 12,
    features: ['PDF Format', 'English', 'Beginner', 'Instant Download'],
    instructor: 'Dr. Sunita Rao',
    phone: '(201) 555-0126',
    oldPrice: 249,
    discount: 20,
    curriculum: ['Parenting Basics', 'Effective Communication', 'Support Strategies'],
    overview: 'A practical guide for parents to support their children’s learning and well-being.'
  },
  {
    id: 5,
    name: 'Speech Therapy Workshop',
    description: 'Live workshop for speech therapy techniques',
    price: 650,
    category: 'Workshops',
    img: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80',
    author: 'Ms. Priya Singh',
    rating: 4.9,
    reviews: 27,
    features: ['Live Workshop', 'English', 'Intermediate', '2 Weeks', 'Certificate'],
    instructor: 'Ms. Priya Singh',
    phone: '(201) 555-0127',
    oldPrice: 750,
    discount: 13,
    curriculum: ['Speech Basics', 'Therapy Techniques', 'Practice Sessions'],
    overview: 'A hands-on workshop for parents and educators to learn effective speech therapy techniques.'
  }
];

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === Number(id)) || products[0];
  const [tab, setTab] = useState('Overview');

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="text-sm mb-4 text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link> <span className="mx-1">&gt;&gt;</span> <Link href="/products" className="hover:text-blue-600">Product Details</Link>
          </div>
          {/* Title & Meta */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-700 text-sm">
            <span className="flex items-center gap-2"><img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-7 h-7 rounded-full border-2 border-blue-200" alt="author" />By {product.author}</span>
            <span className="flex items-center gap-2"><svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>{product.rating} ({product.reviews} Reviews)</span>
            <span className="flex items-center gap-2"><svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>{product.category}</span>
          </div>
          {/* Image */}
          <img src={product.img} alt={product.name} className="w-full max-w-2xl rounded-2xl shadow-lg mb-6 object-cover" />
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full font-bold text-sm border ${tab === t ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-200'} transition`}>{t}</button>
            ))}
          </div>
          {/* Tab Content */}
          {tab === 'Overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Course Overview</h2>
              <p className="mb-4 text-gray-700 text-lg">{product.overview}</p>
              <h3 className="font-bold text-lg mb-2 text-blue-900">What You'll Learn</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Gain expertise in special education or your chosen topic.</li>
                <li>Hands-on activities and real-world application.</li>
                <li>Progress tracking and personalized feedback.</li>
                <li>Access to resources for parents and educators.</li>
              </ul>
              <h3 className="font-bold text-lg mb-2 text-blue-900">Course Features</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                {product.features.map(f => (<li key={f}>{f}</li>))}
              </ul>
              <div className="text-gray-600 text-sm">Certification available upon completion.</div>
            </div>
          )}
          {tab === 'Curriculum' && (
            <div>
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Curriculum</h2>
              <ul className="list-disc pl-6 text-gray-700">
                {product.curriculum?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
          {tab === 'Instructor' && (
            <div>
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Instructor</h2>
              <div className="flex items-center gap-4 mb-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-14 h-14 rounded-full border-2 border-blue-200" alt="instructor" />
                <div>
                  <div className="font-bold text-blue-900">{product.instructor}</div>
                  <div className="text-gray-600 text-sm">Specialist in {product.category}</div>
                </div>
              </div>
              <p className="text-gray-700">Expert instructor with years of experience in special education and digital learning.</p>
            </div>
          )}
          {tab === 'Reviews' && (
            <div>
              <h2 className="text-2xl font-bold mb-3 text-blue-900">Reviews</h2>
              <div className="text-gray-600">No reviews yet. Be the first to review this product!</div>
            </div>
          )}
        </div>
        {/* Right Summary Card */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-28">
            <img src={product.img} alt={product.name} className="w-32 h-32 object-cover rounded-xl mx-auto mb-4" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-extrabold text-blue-900">₹{product.price}</span>
              {product.oldPrice && <span className="text-gray-400 line-through text-lg">₹{product.oldPrice}</span>}
              {product.discount && <span className="ml-2 text-pink-600 font-bold">{product.discount}% OFF</span>}
            </div>
            <button className="w-full py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg mb-2">Add To Cart</button>
            <button className="w-full py-3 bg-pink-100 text-pink-700 font-bold rounded-full shadow hover:bg-pink-200 transition text-lg mb-4">Buy Now</button>
            <div className="text-center text-gray-500 text-xs mb-4">45-Days Money-Back Guarantee</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Lessons</span><span>20</span></div>
              <div className="flex justify-between"><span>Language</span><span>English</span></div>
              <div className="flex justify-between"><span>Course Level</span><span>Beginner</span></div>
              <div className="flex justify-between"><span>Reviews</span><span>4.8 (2.3k)</span></div>
              <div className="flex justify-between"><span>Quizzes</span><span>5</span></div>
              <div className="flex justify-between"><span>Duration</span><span>9 Weeks</span></div>
              <div className="flex justify-between"><span>Students</span><span>3.7k</span></div>
              <div className="flex justify-between"><span>Certifications</span><span>Yes</span></div>
              <div className="flex justify-between"><span>Pass Percentage</span><span>80%</span></div>
              <div className="flex justify-between"><span>Deadline</span><span>25 Dec, 2025</span></div>
              <div className="flex justify-between"><span>Instructor</span><span>{product.instructor}</span></div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-xs text-gray-500 mb-2">More inquiry about course.</div>
              <a href={`tel:${product.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold hover:bg-blue-100 transition"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 21 16.91z" /></svg>{product.phone}</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
