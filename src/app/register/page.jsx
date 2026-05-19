'use client';
import { useState } from 'react';
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const validatePassword = (pass) => {
    if (!pass) return "Password field cannot be empty.";
    if (pass.length < 6) return "Password length must be at least 6 characters.";
    if (!/[A-Z]/.test(pass)) return "Password must have an Uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must have a Lowercase letter.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return; 
    }

    setLoading(true);

    try {
   
      const response = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: photoUrl,
        callbackURL: '/login'
      });

    
      if (response?.error) {
        setError(response.error.message || "Registration failed. Please try again.");
      } else {
        
        router.push('/login');
      }
    } catch (err) {
     
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (err) {
      setError("Google Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">User Registration</h2>
          <p className="mt-2 text-sm text-slate-500">Create your account to get started</p>
        </div>

      
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="Your Name" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="name@example.com" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Photo-URL</label>
            <input type="url" required value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="https://example.com/photo.jpg" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-all">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}