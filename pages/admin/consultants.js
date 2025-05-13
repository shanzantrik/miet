import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminConsultantsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin: Manage Consultants</h1>
        {/* List, approve, or reject consultants here */}
      </div>
      <Footer />
    </>
  );
}
