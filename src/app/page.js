'use client';
import { useState, useEffect } from 'react'; // ডেটা লোড করার জন্য হুকস ইমপোর্ট করা হলো
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiBookOpen, FiCheckCircle, FiArrowRight, FiShield, FiTrendingUp, FiSmile } from 'react-icons/fi';
import Banner from "@/components/Banner";
import TutorCard from "@/components/TutorCard";

export default function Home() {
  // ডাটাবেজের টিউটর ডেটা রাখার জন্য স্টেট
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 এক্সপ্রেস ব্যাকএন্ড সার্ভার থেকে ডেটা ফেচ (Fetch) করা
  useEffect(() => {
    fetch('http://localhost:5000/featured-tutors')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedTutors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="w-full min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 space-y-20 pb-20">
      
      {/* ১. ব্যানার সেকশন */}
      <Banner />

      {/* ২. Available Tutors Section ($limit: 6) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">Top Instructors</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Available Expert Tutors
            </h2>
          </div>
          <Link href="/tutors" className="inline-flex items-center space-x-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors group">
            <span>View All Tutors</span>
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 🌟 ডেটা লোড হওয়ার সময়ের কন্ডিশনাল রেন্ডারিং */}
        {loading ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            লোডিং হচ্ছে... দয়া করে অপেক্ষা করুন...
          </div>
        ) : featuredTutors.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            ডাটাবেজে কোনো টিউটরের ডেটা পাওয়া যায়নি!
          </div>
        ) : (
          /* কার্ড লেআউট গ্রিড */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTutors.map((tutor) => (
              // মঙ্গোডিবির ইউনিক আইডি _id ব্যবহার করা হয়েছে key হিসেবে
              <TutorCard key={tutor._id || tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </section>

      {/* ৩. Extra Section 1: Platform Impact & Statistics */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-t border-b border-slate-100 dark:border-slate-800/60 py-16 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">Our Milestones</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Empowering Learners Globally
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: <FiUsers className="h-6 w-6" />, count: "12,000+", label: "Happy Students" },
              { icon: <FiAward className="h-6 w-6" />, count: "450+", label: "Certified Tutors" },
              { icon: <FiBookOpen className="h-6 w-6" />, count: "85,000+", label: "Sessions Booked" },
              { icon: <FiSmile className="h-6 w-6" />, count: "99.4%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center shadow-sm"
              >
                <div className="inline-flex p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{stat.count}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. Extra Section 2: Core Platform Benefits */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Why Choose MediQueue</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              A Smooth Learning Journey Built For Success
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We eliminate traditional scheduling hassles by bridging the gap between medical professionals, advanced programmers, and students in real time.
            </p>
            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center space-x-2 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-5 py-3 rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all active:scale-95">
                <span>Get Started Now</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <FiShield />, title: "Verified Instructors", desc: "Every tutor undergoes background and qualification verification checks." },
              { icon: <FiTrendingUp />, title: "Flexible Scheduling", desc: "Book 1-on-1 slots that perfectly align with your own timeline and time-zone." },
              { icon: <FiCheckCircle />, title: "Interactive Learning", desc: "Engage via dedicated live dashboards, chat options, and direct session access." },
              { icon: <FiBookOpen />, title: "Diverse Subjects", desc: "From intricate medical anatomy modules to advanced engineering logic." }
            ].map((feat, i) => (
              <div key={i} className="flex space-x-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="shrink-0 text-xl text-emerald-600 dark:text-emerald-400 pt-1">
                  {feat.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{feat.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}