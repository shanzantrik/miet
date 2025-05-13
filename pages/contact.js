import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Send form data to backend or email service
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-16 md:py-24 overflow-hidden min-h-[80vh]">
        {/* Animated SVG background shapes */}
        <svg className="absolute left-0 top-0 w-40 h-40 text-blue-100 animate-bounce-slow z-0" fill="none" viewBox="0 0 160 160"><circle cx="80" cy="80" r="80" fill="currentColor" /></svg>
        <svg className="absolute right-0 top-20 w-24 h-24 text-yellow-100 animate-spin-slow z-0" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
        <svg className="absolute left-1/2 bottom-0 w-32 h-32 text-blue-50 animate-float z-0" fill="none" viewBox="0 0 128 128"><polygon points="64,0 128,128 0,128" fill="currentColor" /></svg>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-stretch px-6 relative z-10">
          {/* Left: Info & Map */}
          <div className="flex flex-col gap-8 justify-between">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 animate-hero-fade">Contact Us</h1>
              <p className="text-blue-800 text-lg max-w-md animate-hero-fade delay-150">We'd love to hear from you! Reach out for any queries, support, or partnership opportunities.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Address */}
                <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4 border-l-4 border-blue-500 animate-pop-in">
                  <span className="bg-blue-100 p-3 rounded-full"><svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" /></svg></span>
                  <div>
                    <div className="font-bold text-blue-900">Address</div>
                    <div className="text-blue-800 text-sm">123 Main St, Your City, Country</div>
                  </div>
                </div>
                {/* Phone */}
                <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4 border-l-4 border-yellow-400 animate-pop-in delay-150">
                  <span className="bg-yellow-100 p-3 rounded-full"><svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5A1 1 0 013 3.5H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" fill="currentColor" /></svg></span>
                  <div>
                    <div className="font-bold text-blue-900">Phone</div>
                    <div className="text-blue-800 text-sm">+1 234 567 890</div>
                  </div>
                </div>
                {/* Email */}
                <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4 border-l-4 border-pink-400 animate-pop-in delay-300">
                  <span className="bg-pink-100 p-3 rounded-full"><svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24"><path d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0l-9 6-9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <div>
                    <div className="font-bold text-blue-900">Email</div>
                    <div className="text-blue-800 text-sm">info@miet.com</div>
                  </div>
                </div>
                {/* Hours */}
                <div className="bg-white rounded-2xl shadow p-5 flex items-start gap-4 border-l-4 border-green-400 animate-pop-in delay-450">
                  <span className="bg-green-100 p-3 rounded-full"><svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <div>
                    <div className="font-bold text-blue-900">Working Hours</div>
                    <div className="text-blue-800 text-sm">Sat - Thu: 07:00 AM - 12:30 PM</div>
                  </div>
                </div>
              </div>
              {/* Social icons */}
              <div className="flex gap-4 mt-6">
                <a href="https://facebook.com" target="_blank" rel="noopener" className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white shadow-lg"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z" /></svg></a>
                <a href="https://twitter.com" target="_blank" rel="noopener" className="p-3 rounded-full bg-blue-400 hover:bg-blue-500 transition text-white shadow-lg"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 012 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0022.46 6z" /></svg></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener" className="p-3 rounded-full bg-blue-900 hover:bg-blue-800 transition text-white shadow-lg"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg></a>
                <a href="mailto:info@miet.com" className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 transition text-white shadow-lg"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24"><path d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0l-9 6-9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              </div>
            </div>
            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-blue-100 animate-pop-in delay-600">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.953736315904!3d-37.8162797420217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f9f1fd%3A0xf577c7b2b1a0b1a1!2s123%20Main%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          {/* Right: Contact Form */}
          <div className="flex flex-col justify-center bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-blue-100 animate-hero-fade delay-300">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-green-600 text-lg font-semibold flex flex-col items-center gap-2 animate-pop-in">
                <svg className="h-12 w-12 text-green-400 mb-2" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#bbf7d0" /><path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Thank you for your query! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Floating label input */}
                <div className="relative">
                  <input name="name" id="name" value={form.name} onChange={handleChange} required className="peer block w-full px-4 pt-6 pb-2 text-lg bg-transparent border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 transition placeholder-transparent" placeholder="Your Name" />
                  <label htmlFor="name" className="absolute left-4 top-2 text-blue-700 text-base font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-blue-700">Your Name</label>
                </div>
                <div className="relative">
                  <input name="email" id="email" type="email" value={form.email} onChange={handleChange} required className="peer block w-full px-4 pt-6 pb-2 text-lg bg-transparent border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 transition placeholder-transparent" placeholder="Your Email" />
                  <label htmlFor="email" className="absolute left-4 top-2 text-blue-700 text-base font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-blue-700">Your Email</label>
                </div>
                <div className="relative">
                  <textarea name="message" id="message" value={form.message} onChange={handleChange} required rows={4} className="peer block w-full px-4 pt-6 pb-2 text-lg bg-transparent border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 transition placeholder-transparent resize-none" placeholder="Your Message" />
                  <label htmlFor="message" className="absolute left-4 top-2 text-blue-700 text-base font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-blue-700">Your Message</label>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-800 transition text-lg flex items-center justify-center gap-2 animate-cta-bounce">
                  Send Message
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </form>
            )}
          </div>
        </div>
        <style jsx>{`
          .animate-bounce-slow {
            animation: bounce 4s infinite alternate;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite alternate;
          }
          .animate-hero-fade {
            opacity: 0;
            transform: translateY(30px);
            animation: heroFadeIn 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
          }
          .animate-hero-fade.delay-150 {
            animation-delay: 0.15s;
          }
          .animate-hero-fade.delay-300 {
            animation-delay: 0.3s;
          }
          .animate-pop-in {
            opacity: 0;
            transform: scale(0.7);
            animation: popIn 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
          }
          .animate-pop-in.delay-150 {
            animation-delay: 0.15s;
          }
          .animate-pop-in.delay-300 {
            animation-delay: 0.3s;
          }
          .animate-pop-in.delay-450 {
            animation-delay: 0.45s;
          }
          .animate-pop-in.delay-600 {
            animation-delay: 0.6s;
          }
          .animate-cta-bounce {
            animation: ctaBounce 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(30px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-20px); }
          }
          @keyframes heroFadeIn {
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes ctaBounce {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes popIn {
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>
      <Footer />
    </>
  );
}
