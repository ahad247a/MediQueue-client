'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchTutors = async () => {
      try {
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/tutors`);
        if (res.ok) {
          const data = await res.json();
          setTutors(data);
        }
      } catch (error) {
        console.error("Failed to load tutors from Express server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading Tutors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
       
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            Available Tutors
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Browse our professional tutors and book a session to boost your learning.
          </p>
        </div>

   
        {tutors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto">
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">No Tutors Found!</p>
            <p className="text-xs text-slate-400 mt-1 mb-6">আপনার মঙ্গোডিবি কালেকশনে কোনো ডাটা নেই।</p>
            <Link href="/add-tutors" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition-all">
              Add First Tutor
            </Link>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div 
                key={tutor._id} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  
                  <div className="relative h-52 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={tutor.image || tutor.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                      alt={tutor.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {tutor.type && (
                      <span className="absolute top-3 right-3 rounded-lg bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
                        {tutor.type}
                      </span>
                    )}
                  </div>

                  
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {tutor.subject || "General"}
                    </span>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Slots: {tutor.totalSlot || tutor.slots || 0}
                    </span>
                  </div>
                  
                 
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
                    {tutor.name}
                  </h3>
                  
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    📧 {tutor.email || "No Email Provided"}
                  </p>
                  
                  
                  {tutor.location && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-1">
                      📍 {tutor.location}
                    </p>
                  )}

                 
                  {tutor.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 line-clamp-2 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl italic">
                      {tutor.description}
                    </p>
                  )}
                </div>

                
                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Salary / Fee</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                      ৳{tutor.hourlyFee || tutor.price || tutor.salary || 0}
                    </p>
                  </div>
                  
                 
                  <Link 
                    href={`/tutors/${tutor._id}`}
                    className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all"
                  >
                    Book Session
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}