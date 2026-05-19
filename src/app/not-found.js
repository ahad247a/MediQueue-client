'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 transition-colors duration-300">
      <div className="relative mx-auto max-w-md">
        
       
        <div className="absolute -inset-10 -z-10 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5 animate-pulse"></div>
        
        
        <div className="text-8xl md:text-9xl mb-4 animate-bounce duration-1000">
          🔍
        </div>

      
        <h1 className="text-6xl font-black tracking-tight text-slate-800 dark:text-slate-100 md:text-7xl">
          404
        </h1>
        
        <h2 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-300 md:text-2xl">
          Oops! Page Not Found
        </h2>
        
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Lets get you back on track!
        </p>

       
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          
         
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            ← Go Back
          </button>

         
          <Link
            href="/"
            className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 dark:from-emerald-400 dark:to-teal-300 dark:text-slate-950 transition-all text-center"
          >
            Take Me Home
          </Link>
          
        </div>
        
      </div>
    </div>
  );
}