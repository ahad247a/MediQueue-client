'use client';
import { useState } from 'react';
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email: email,
      password: password,
      callbackURL: '/' 
    });

    if (authError) {
      toast.error(authError.message || "Invalid email or password.");
      setLoading(false);
    } else {
      toast.success("Login successful! Redirecting...");
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">User Login</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm focus:outline-emerald-500" placeholder="name@example.com" />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase text-slate-700">Password</label>
              <button type="button" onClick={() => toast.info("Forgot password feature is currently disabled.")} className="text-xs text-emerald-600 hover:underline font-medium">Forgot Password?</button>
            </div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm focus:outline-emerald-500" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-all">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-slate-200"></div>
          <span className="shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-slate-500">
          Do not have an account? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}