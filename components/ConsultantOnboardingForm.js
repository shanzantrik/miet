import { useState, useEffect } from 'react';
import api from '../utils/api';

function Countdown() {
  // Example: static countdown for demo
  const [time, setTime] = useState({ days: 597, hours: 8, minutes: 6, seconds: 45 });
  // You can add real countdown logic if needed
  return (
    <div className="flex gap-6 justify-center md:justify-start mb-8">
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-700 font-extrabold text-3xl md:text-4xl px-6 py-4 rounded-2xl shadow mb-1">{time.days}</div>
        <span className="text-blue-700 font-semibold">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-700 font-extrabold text-3xl md:text-4xl px-6 py-4 rounded-2xl shadow mb-1">{time.hours}</div>
        <span className="text-blue-700 font-semibold">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-700 font-extrabold text-3xl md:text-4xl px-6 py-4 rounded-2xl shadow mb-1">{time.minutes}</div>
        <span className="text-blue-700 font-semibold">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-100 text-blue-700 font-extrabold text-3xl md:text-4xl px-6 py-4 rounded-2xl shadow mb-1">{time.seconds}</div>
        <span className="text-blue-700 font-semibold">Seconds</span>
      </div>
    </div>
  );
}

export default function ConsultantOnboardingForm() {
  const [form, setForm] = useState({ userId: '', bio: '', documents: null });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = e => setForm({ ...form, documents: e.target.files[0] });

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('userId', form.userId);
    data.append('bio', form.bio);
    if (form.documents) data.append('documents', form.documents);
    try {
      await api.post('/consultants/onboard', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Consultant onboarding submitted!');
    } catch (err) {
      setMessage('Error submitting form');
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-50 via-white to-pink-50 py-16 px-4 md:px-0 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Image and shapes */}
        <div className="relative flex justify-center items-center min-h-[340px]">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
            alt="Consultant CTA"
            className="w-80 h-96 object-cover rounded-3xl shadow-lg border-4 border-blue-100 relative z-20"
          />
          {/* Decorative shapes */}
          <svg className="absolute left-0 top-0 w-24 h-24 text-blue-100" fill="none" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="currentColor" /></svg>
          <svg className="absolute right-0 top-20 w-16 h-16 text-pink-200" fill="none" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="currentColor" /></svg>
          <svg className="absolute left-1/2 bottom-0 w-20 h-20 text-yellow-100" fill="none" viewBox="0 0 80 80"><polygon points="40,0 80,80 0,80" fill="currentColor" /></svg>
        </div>
        {/* Right: CTA and form */}
        <div className="flex flex-col items-start justify-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 leading-tight mb-4">
            Join Us for a Free <span className="relative inline-block text-blue-700 animate-pulse">Consultant Onboarding
              <span className="absolute left-0 bottom-0 w-full h-2 bg-blue-200 rounded-full -z-10 animate-underline" style={{ zIndex: -1 }}></span>
            </span> Session Today
          </h2>
          <Countdown />
          <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4">
            <input name="userId" placeholder="User ID" onChange={handleChange} className="block w-full p-3 border border-blue-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-400" />
            <textarea name="bio" placeholder="Bio" onChange={handleChange} className="block w-full p-3 border border-blue-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-400" rows={3} />
            <input type="file" name="documents" onChange={handleFile} className="block w-full text-blue-700" />
            <button type="submit" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-full shadow hover:bg-blue-800 transition text-lg flex items-center gap-2 self-start">
              Sign Up Now
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {message && <div className="mt-2 text-blue-700 font-semibold">{message}</div>}
          </form>
        </div>
      </div>
      <style jsx>{`
        .animate-underline {
          animation: underlineGrow 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes underlineGrow {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
