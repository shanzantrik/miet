import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminProductsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin: Manage Products</h1>
        {/* List, add, edit, or delete products here */}
      </div>
      <Footer />
    </>
  );
}
