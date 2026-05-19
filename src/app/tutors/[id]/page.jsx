'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client"; 

export default function TutorDetailsPage() {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ফর্ম ইনপুট স্টেট
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  
  // 🔒 Better-Auth সেশন চেক
  const { data: session, isPending: authLoading } = authClient.useSession();

  useEffect(() => {
    if (!authLoading && !session?.user) {
      router.push('/login');
    } else if (session?.user) {
      // সেশন থেকে ইউজারের নাম অটো-ফিল করা
      setStudentName(session.user.name || '');
    }
  }, [session, authLoading, router]);

  // 📡 এক্সপ্রেস সার্ভার থেকে ডাটা নিয়ে আসা
  useEffect(() => {
    if (authLoading) return;

    const fetchTutorDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tutors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTutor(data);
        }
      } catch (error) {
        console.error("Express data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [id, authLoading]);

  // 🛠️ বুকিং সাবমিট হ্যান্ডলার
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    const bookingPayload = {
      studentName,
      phone,
      tutorId: id,
      tutorName: tutor.name,
      studentEmail: session?.user?.email,
    };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('🎉 Booking Successful!');
        setIsModalOpen(false);
        setPhone('');
        // বুকিং শেষে পেজের ডাটা রিলোড করা যাতে আপডেটেড স্লট দেখা যায়
        window.location.reload();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <p className="text-lg font-bold text-rose-500">Tutor Not Found!</p>
          <Link href="/tutors" className="mt-4 inline-block text-sm text-emerald-600 font-semibold hover:underline">
            ← Back to All Tutors
          </Link>
        </div>
      </div>
    );
  }

  // 🔴 রিকোয়ারমেন্ট কন্ডিশন চেক
  const totalSlot = tutor.totalSlot || tutor.slots || 0;
  const isSlotEmpty = totalSlot <= 0;
  
  const currentDate = new Date();
  const sessionDate = tutor.sessionDate ? new Date(tutor.sessionDate) : null;
  const isDateEarly = sessionDate ? currentDate < sessionDate : false;

  // বাটন ডিসেবল করার লজিক
  const isBookingBlocked = isSlotEmpty || isDateEarly;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* ইমেজ সেকশন */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={tutor.image || tutor.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
            alt={tutor.name} 
            className="w-full h-full object-cover" 
          />
          <Link href="/tutors" className="absolute top-4 left-4 bg-slate-900/70 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-xs transition-colors hover:bg-slate-900">
            ← Back
          </Link>
        </div>

        {/* বডি ডিটেইলস */}
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {tutor.subject || "General"}
              </span>
              <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
                {tutor.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                📧 {tutor.email || "No Email Provided"}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Salary / Fee</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ৳{tutor.hourlyFee || tutor.price || tutor.salary || 0} <span className="text-xs font-normal text-slate-500">/ hr</span>
              </p>
            </div>
          </div>

          {/* ইনফরমেশন গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tutor Profile</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>📍 Location:</strong> {tutor.location || 'Not Specified'}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>🎓 Institution:</strong> {tutor.institution || 'N/A'}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>🎟️ Available Slots:</strong> <span className={`font-bold ${isSlotEmpty ? 'text-rose-500' : 'text-emerald-600'}`}>{totalSlot}</span>
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Availability</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>📅 Session Date:</strong> {tutor.sessionDate ? new Date(tutor.sessionDate).toLocaleDateString() : 'Not Set'}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>📅 Days:</strong> {tutor.availableDays || 'Contact for schedule'}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300"><strong>⏰ Time:</strong> {tutor.availableTime || 'Flexible'}</p>
            </div>
          </div>

          {/* কন্ডিশনাল ওয়ার্নিং মেসেজ ডিসপ্লে */}
          {isSlotEmpty && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-2xl border border-rose-100 dark:border-rose-900/30 text-center">
              ⚠️ No available slots left. This session is fully booked. You can’t join at the moment.
            </div>
          )}

          {!isSlotEmpty && isDateEarly && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-sm font-semibold rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
              📅 Booking is not available yet for this tutor. (সেশনের তারিখের আগে বুকিং করা যাবে না)
            </div>
          )}

          {/* বুকিং অ্যাকশন বাটন */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              disabled={isBookingBlocked}
              onClick={() => setIsModalOpen(true)} 
              className={`w-full sm:w-auto px-8 py-3.5 text-white font-bold rounded-xl shadow-md text-sm transition-all cursor-pointer ${
                isBookingBlocked 
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' 
                  : 'bg-linear-to-r from-emerald-600 to-teal-500 hover:opacity-95'
              }`}
            >
              {isSlotEmpty ? 'Fully Booked' : isDateEarly ? 'Booking Not Available Yet' : 'Book Session'}
            </button>
          </div>
        </div>
      </div>

      {/* 📥 🎯 বুক সেশন পপআপ মোডাল (Modal Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Book Session</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >✕</button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
              {/* স্টুডেন্ট নাম ইনপুট */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student Name</label>
                <input 
                  type="text" 
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* ফোন নাম্বার ইনপুট */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* টিউটর আইডি (Auto-filled & Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tutor ID (Auto)</label>
                <input 
                  type="text" 
                  readOnly
                  value={id}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* টিউটর নাম (Auto-filled & Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tutor Name (Auto)</label>
                <input 
                  type="text" 
                  readOnly
                  value={tutor.name}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* স্টুডেন্ট ইমেইল (Auto-filled & Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Student Email (Auto)</label>
                <input 
                  type="text" 
                  readOnly
                  value={session?.user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* সাবমিট বাটন */}
              <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full mt-2 py-3 bg-linear-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-xl shadow-md text-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {bookingLoading ? 'Processing Booking...' : 'Confirm Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}