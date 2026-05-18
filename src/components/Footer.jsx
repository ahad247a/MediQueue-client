'use client';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* মেইন গ্রিড লেআউট */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* ১. লোগো এবং সংক্ষিপ্ত বিবরণ */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-300">
                MediQueue
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Connecting eager learners with expert tutors worldwide. Book, learn, and grow your digital skills efficiently.
            </p>
          </div>

          {/* ২. লার্নিং সার্ভিসেস লিংক (Tutor/Learning Services Links) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Learning Services
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/tutors?category=web-development" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/tutors?category=programming" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                  Programming Languages
                </Link>
              </li>
              <li>
                <Link href="/tutors?category=data-science" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                  Data Science
                </Link>
              </li>
              <li>
                <Link href="/tutors?category=ui-ux-design" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                  UI/UX Design
                </Link>
              </li>
            </ul>
          </div>

          {/* ৩. কন্টাক্ট ইনফরমেশন (Contact Information) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <FiMail className="h-4 w-4 text-emerald-500" />
                <span className="truncate">support@mediqueue.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="h-4 w-4 text-emerald-500" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin className="h-4 w-4 text-emerald-500" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* ৪. সোশ্যাল লিংক (Social Links) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Follow Us
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Stay connected through our social handles.</p>
            <div className="mt-4 flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-900 dark:hover:bg-emerald-500 transition-all duration-300">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-900 dark:hover:bg-emerald-500 transition-all duration-300">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-900 dark:hover:bg-emerald-500 transition-all duration-300">
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-900 dark:hover:bg-emerald-500 transition-all duration-300">
                <FiGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>

        {/* ৫. কপিরাইট ইনফরমেশন (Copyright Information) */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {currentYear} MediQueue. All rights reserved. Designed for excellence.
          </p>
        </div>

      </div>
    </footer>
  );
}