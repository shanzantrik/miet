import { useState } from 'react';

export default function LoginForm({ open, onClose, onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
        <button
          className="absolute top-3 right-3 text-blue-900 hover:text-red-500"
          onClick={onClose}
          aria-label="Close login"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">Log In to MieT</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition">Log In</button>
        </form>
        <div className="my-4 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-gray-300" />
          <span className="text-gray-400 text-sm">or continue with</span>
          <span className="h-px w-10 bg-gray-300" />
        </div>
        <div className="flex gap-4 justify-center mb-4">
          <button className="p-2 rounded-full border hover:bg-blue-50 transition" aria-label="Login with Google">
            <svg className="h-6 w-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.87-6.87C35.64 2.7 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l8.06 6.26C12.36 13.98 17.67 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z" /><path fill="#FBBC05" d="M10.75 28.35c-1.13-3.36-1.13-6.99 0-10.35l-8.06-6.26C.98 15.1 0 19.41 0 24c0 4.59.98 8.9 2.69 12.26l8.06-6.26z" /><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.03 15.54-5.53l-7.19-5.6c-2.01 1.35-4.59 2.13-8.35 2.13-6.33 0-11.64-4.48-13.25-10.51l-8.06 6.26C6.73 42.18 14.82 48 24 48z" /></g></svg>
          </button>
          <button className="p-2 rounded-full border hover:bg-blue-50 transition" aria-label="Login with Facebook">
            <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
          </button>
        </div>
        <div className="text-center text-sm text-gray-500">Don't have an account? <button className="text-blue-600 font-bold hover:underline" onClick={onSignup}>Sign Up</button></div>
      </div>
    </div>
  );
}
