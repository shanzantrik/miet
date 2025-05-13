import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="mb-4">
          <h2 className="font-semibold">How do I book a session with a consultant?</h2>
          <p>Register or log in, search for a consultant, and use the booking feature on their profile.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold">How do I upload my credentials as a consultant?</h2>
          <p>Use the consultant onboarding form to upload your documents and submit your profile for approval.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold">How do I purchase products or services?</h2>
          <p>Browse the e-commerce section, add items to your cart, and proceed to checkout with secure payment options.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold">Who can access my assessment reports?</h2>
          <p>Only you and authorized professionals can access your reports. Admins may review for quality assurance.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
