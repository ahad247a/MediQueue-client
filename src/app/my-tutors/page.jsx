'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client";

export default function MyTutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // মডাল ও এডিটিং স্টেট
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // এডিট ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: '', subject: '', hourlyFee: '', totalSlot: '', 
    location: '', sessionDate: '', description: '', image: '', type: ''
  });

  const router = useRouter();
  
  // 🔒 Better-Auth প্রাইভেট রুট প্রোটেকশন
  const { data: session, isPending: authLoading } = authClient.useSession();

  useEffect(() => {
    if (!authLoading && !session?.user) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  // 📡 লগড-ইন ইউজারের ইমেইল অনুযায়ী এক্সপ্রেস সার্ভার থেকে ডাটা লোড করা
  useEffect(() => {
    if (authLoading || !session?.user?.email) return;

    const fetchMyTutors = async () => {
      try {
        // 💡 আপনার এক্সপ্রেস ব্যাকএন্ডে আমরা একটি নতুন কুয়েরি ফিল্টার রুট ব্যবহার করব
        const res = await fetch(`http://localhost:5000/api/my-tutors?email=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setTutors(data);
        }
      } catch (error) {
        console.error("Failed to fetch my tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTutors();
  }, [session, authLoading]);

  // 📝 আপডেট মডাল ওপেন ও ডাটা প্রি-ফিল করা
  const openUpdateModal = (tutor) => {
    setSelectedTutor(tutor);
    setFormData({
      name: tutor.name || '',
      subject: tutor.subject || '',
      hourlyFee: tutor.hourlyFee || tutor.price || tutor.salary || 0,
      totalSlot: tutor.totalSlot || tutor.slots || 0,
      location: tutor.location || '',
      sessionDate: tutor.sessionDate ? tutor.sessionDate.split('T')[0] : '', // HTML date input এর ফরম্যাট ঠিক রাখার জন্য
      description: tutor.description || '',
      image: tutor.image || tutor.photo || '',
      type: tutor.type || ''
    });
    setIsUpdateModalOpen(true);
  };

  // 💾 আপডেট সাবমিট হ্যান্ডলার (পেজ রিলোড ছাড়া রিফ্লেক্ট হবে)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/tutors/${selectedTutor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedData = await res.json();
        
        // 🎯 রিলোড ছাড়া সাথে সাথে স্টেট আপডেট করা
        setTutors(prevTutors => 
          prevTutors.map(t => t._id === selectedTutor._id ? { ...t, ...formData } : t)
        );
        
        alert('🎉 Tutor information updated successfully!');
        setIsUpdateModalOpen(false);
      } else {
        alert('Failed to update tutor.');
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // 🗑️ ডিলিট কনফার্মেশন হ্যান্ডলার
  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tutors/${selectedTutor._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // 🎯 রিলোড ছাড়া স্টেট থেকে টিউটরটি ইনস্ট্যান্টলি রিমুভ করা
        setTutors(prevTutors => prevTutors.filter(t => t._id !== selectedTutor._id));
        alert('🗑️ Tutor deleted successfully!');
        setIsDeleteModalOpen(false);
      } else {
        alert('Failed to delete tutor.');
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading your tutors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* হেডার সেকশন */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              My Tutors List
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage all the professional tutor posts created by you.
            </p>
          </div>
          <Link href="/add-tutors" className="inline-block rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-all text-center">
            + Add New Tutor
          </Link>
        </div>

        {/* 📋 কন্ডিশনাল রেন্ডারিং: ডাটাবেজ ফাকা থাকলে Friendly Empty State */}
        {tutors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-700 dark:text-slate-300 font-bold text-xl">No Tutors Posted Yet!</p>
            <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
              আপনি এখনো কোনো টিউটর পোস্ট তৈরি করেননি। আপনার প্রথম টিউটর সার্কুলারটি তৈরি করতে নিচের বাটনে ক্লিক করুন।
            </p>
            <Link href="/add-tutors" className="rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all">
              Create First Post
            </Link>
          </div>
        ) : (
          /* 📊 রেসপন্সিভ টেবিল লেআউট */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-5">Tutor Info</th>
                    <th className="p-5">Subject</th>
                    <th className="p-5">Fee / Rate</th>
                    <th className="p-5">Slots Remaining</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  {tutors.map((tutor) => (
                    <tr key={tutor._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-5 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={tutor.image || tutor.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                          alt={tutor.name} 
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{tutor.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{tutor.type || 'Online'}</p>
                        </div>
                      </td>
                      <td className="p-5 font-medium text-emerald-600 dark:text-emerald-400">{tutor.subject || 'General'}</td>
                      <td className="p-5 font-bold">৳{tutor.hourlyFee || tutor.price || tutor.salary || 0}/hr</td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          (tutor.totalSlot || 0) === 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {tutor.totalSlot || tutor.slots || 0} Slots
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button 
                          onClick={() => openUpdateModal(tutor)}
                          className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-lg border border-amber-200/50 dark:border-amber-900/30 hover:bg-amber-100 transition-all cursor-pointer"
                        >
                          Update
                        </button>
                        <button 
                          onClick={() => { setSelectedTutor(tutor); setIsDeleteModalOpen(true); }}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-lg border border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          Delete
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

      {/* 📝 ১. আপডেট মডাল ফৰ্ম (Update Modal) */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">Update Tutor Info</h3>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hourly Fee (৳)</label>
                  <input type="number" required value={formData.hourlyFee} onChange={(e) => setFormData({...formData, hourlyFee: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Slots</label>
                  <input type="number" required value={formData.totalSlot} onChange={(e) => setFormData({...formData, totalSlot: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Session Date</label>
                  <input type="date" value={formData.sessionDate} onChange={(e) => setFormData({...formData, sessionDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:border-emerald-500 focus:outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 cursor-pointer disabled:opacity-50">{actionLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ ২. ডিলিট কনফার্মেশন মডাল (Delete Confirmation Modal) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-rose-500 text-4xl mb-2">⚠️</div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Are you absolutely sure?</h3>
            <p className="text-xs text-slate-400 mt-1">This action cannot be undone. This tutor entry will be permanently deleted from database.</p>
            
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer">Cancel</button>
              <button onClick={handleDeleteConfirm} disabled={actionLoading} className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-500 cursor-pointer disabled:opacity-50">{actionLoading ? 'Deleting...' : 'Yes, Delete'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}