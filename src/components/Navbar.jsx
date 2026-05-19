'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { authClient } from "@/lib/auth-client"; 

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Better-Auth লাইভ সেশন
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  // ডার্ক মোড
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  // লগআউট
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsProfileOpen(false);
          setIsOpen(false);
          router.push("/login"); 
        },
      },
    });
  };

  const linkStyle = (path) => {
    const isActive = pathname === path;
    return `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-300">
                MediQueue
              </span>
            </Link>
          </div>

          {/* ডেস্কটপ লিঙ্ক */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className={linkStyle('/')}>Home</Link>
            <Link href="/tutors" className={linkStyle('/tutors')}>Tutors</Link>
            {isLoggedIn && (
              <>
                <Link href="/add-tutors" className={linkStyle('/add-tutors')}>Add Tutor</Link>
                <Link href="/dashboard/my-tutors" className={linkStyle('/dashboard/my-tutors')}>My Tutors</Link>
                <Link href="/dashboard/my-bookings" className={linkStyle('/dashboard/my-bookings')}>My Booked Sessions</Link>
              </>
            )}
          </div>

          {/* রাইট অ্যাকশন */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button onClick={toggleTheme} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer">
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {isPending ? (
              <span className="text-xs text-slate-400">Loading...</span>
            ) : isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="flex items-center justify-center rounded-full border-2 border-emerald-500/50 p-1 bg-slate-100 dark:bg-slate-800 focus:outline-hidden cursor-pointer"
                >
                  {session.user.image ? (
                    /* 🌟 এই কমেন্টটি Next.js এর <img> ওয়ার্নিং বন্ধ করে দেবে */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      className="h-6 w-6 rounded-full object-cover" 
                      src={session.user.image} 
                      alt="User" 
                      width={24}
                      height={24}
                    />
                  ) : (
                    <FiUser className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-800"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                      </div>
                      <button onClick={handleLogout} className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 text-left cursor-pointer">
                        <FiLogOut /> <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity">
                Login / Register
              </Link>
            )}
          </div>

          {/* মোবাইল বাটন */}
          <div className="flex items-center space-x-2 md:hidden">
            <button onClick={toggleTheme} className="rounded-full p-2 text-slate-500 dark:text-slate-400">
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-slate-600 dark:text-slate-300">
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* মোবাইল মেনু */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white px-4 py-3 dark:bg-slate-900 md:hidden overflow-hidden border-t dark:border-slate-800">
            <div className="space-y-1">
              <Link href="/" className="block rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>Home</Link>
              <Link href="/tutors" className="block rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>Tutors</Link>
              
              {isLoggedIn ? (
                <>
                  <Link href="/tutors/add" className="block rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>Add Tutor</Link>
                  <Link href="/dashboard/my-tutors" className="block rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>My Tutors</Link>
                  <Link href="/dashboard/my-bookings" className="block rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300" onClick={() => setIsOpen(false)}>My Booked Sessions</Link>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 px-3 flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-emerald-500/30">
                      {session.user.image ? (
                        /* 🌟 মোবাইল ইমেজের জন্যও ওয়ার্নিং বন্ধ করার কমেন্ট */
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="h-8 w-8 rounded-full object-cover" src={session.user.image} alt="User" width={32} height={32} />
                      ) : (
                        <FiUser className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      )}
                    </div>
                    <div className="truncate max-w-45">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-1 flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 text-left">
                    <FiLogOut /> <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/login" className="mt-4 block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white shadow-md" onClick={() => setIsOpen(false)}>
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}