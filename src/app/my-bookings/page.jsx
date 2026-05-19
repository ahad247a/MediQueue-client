'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

export default function MyBookedSessionsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ক্যানসেল মডাল ও অ্যাকশন স্টেট
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();
  
  // 🔒 Better-Auth প্রাইভেট রুট প্রোটেকশন
  const { data: session, isPending: authLoading } = authClient.useSession();

  useEffect(() => {
    if (!authLoading && !session?.user) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  // 📡 লগড-ইন ইউজারের ইমেইল অনুযায়ী বুকড সেশন ডেটা ফেচ করা
  useEffect(() => {
    // সেশন ও ইমেইল পুরোপুরি লোড না হওয়া পর্যন্ত ব্যাকএন্ডে রিকোয়েস্ট পাঠাবে না
    if (authLoading || !session?.user?.email) return;

    const fetchMyBookings = async () => {
      try {
        // 🌟 ফিক্স: '/api/my-bookings' পরিবর্তন করে সঠিক ব্যাকএন্ড রাউট '/api/bookings' করা হয়েছে
        const res = await fetch(`http://localhost:5000/api/bookings?email=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [session, authLoading]);

  // 🚫 ক্যানসেল কনফার্মেশন সাবমিট হ্যান্ডলার (PATCH Request)
  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return;
    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/cancel/${selectedBookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        // 🎯 পেজ রিলোড ছাড়া সাথে সাথে UI-তে স্ট্যাটাস "cancelled" আপডেট করা
        setBookings(prevBookings =>
          prevBookings.map(b => b._id === selectedBookingId ? { ...b, bookStatus: 'cancelled' } : b)
        );
        alert('🚫 Session booking cancelled successfully.');
        setIsCancelModalOpen(false);
      } else {
        alert('Failed to cancel the booking.');
      }
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setActionLoading(false);
      setSelectedBookingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading your booked sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* হেডার সেকশন */}
        <div className="mb-12">
          <h2 className="text-3xl font-black bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            My Booked Sessions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and manage all the tuition slots you have booked.
          </p>
        </div>

        {/* 📭 কন্ডিশনাল রেন্ডারিং: কোনো বুকিং না থাকলে Friendly Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
            <div className="text-4xl mb-4">🗓️</div>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-xl">No Bookings Found!</p>
            <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
              আপনি এখনো কোনো টিউটরের সেশন বুক করেননি। নতুন সেশন খুঁজে বুক করতে আমাদের টিউটর লিস্ট ঘুরে আসুন।
            </p>
            <Link href="/tutors" className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all">
              Find Tutors
            </Link>
          </div>
        ) : (
          /* 📊 বুকিং টেবিল লেআউট */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-5">Tutor Name</th>
                    <th className="p-5">Student Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-5 font-bold text-slate-800 dark:text-slate-100">
                        {booking.tutorName || 'N/A'}
                      </td>
                      <td className="p-5 font-medium">{booking.studentName}</td>
                      <td className="p-5 text-slate-500 dark:text-slate-400">{booking.studentEmail}</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          booking.bookStatus === 'cancelled' 
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' 
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                        }`}>
                          {booking.bookStatus || 'Confirmed'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          disabled={booking.bookStatus === 'cancelled'}
                          onClick={() => { setSelectedBookingId(booking._id); setIsCancelModalOpen(true); }}
                          className={`px-3 py-1.5 font-bold text-xs rounded-lg border transition-all cursor-pointer ${
                            booking.bookStatus === 'cancelled'
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700'
                              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-100'
                          }`}
                        >
                          {booking.bookStatus === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ⚠️ ক্যানসেল কনফার্মেশন মডাল (Cancel Confirmation Modal) */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-rose-500 text-4xl mb-2">⚠️</div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Cancel this session?</h3>
            <p className="text-xs text-slate-400 mt-1">Are you sure you want to cancel your booking? Your slot will be released.</p>
            
            <div className="flex justify-center gap-3 mt-6">
              <button 
                onClick={() => { setIsCancelModalOpen(false); setSelectedBookingId(null); }} 
                className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelConfirm} 
                disabled={actionLoading} 
                className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-500 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}