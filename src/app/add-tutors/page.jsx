'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client"; // আপনার Better-Auth ক্লায়েন্ট পাথ

export default function AddTutorsPage() {
  const router = useRouter();
  
  // 🌟 Better-Auth এর মাধ্যমে সেশন ও লোডিং স্টেট চেক (Private Route Protection)
  const { data: session, isPending } = authClient.useSession();
  
  // অ্যাসাইনমেন্টের রিকোয়ারমেন্ট অনুযায়ী সব ফর্ম ফিল্ড স্টেট
  const [formData, setFormData] = useState({
    name: '',
    photo: '', // imgbb-link/postimage upload
    subject: 'Mathematics', // Dropdown (Mathematics, Physics, etc)
    availableDays: '', // Example: Sun - Thu
    availableTime: '', // Example: 5:00 PM - 8:00 PM
    hourlyFee: '',
    totalSlot: '',
    startDate: '', // date-picker
    institution: '',
    experience: '',
    location: '', // Area/City
    teachingMode: 'Online' // Dropdown (Online, Offline, Both)
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 🌟 প্রাইভেট রাউট লজিক: লগইন না থাকলে এই পেজ দেখতে দেবে না, সোজা লগইন পেজে পাঠাবে
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // সেশন চেক করার সময় সুন্দর একটি লোডিং দেখাবে
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">Checking private access...</p>
        </div>
      </div>
    );
  }

  // ইনপুট হ্যান্ডলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 🌟 ব্যাকএন্ড API-তে ডেটা পাঠানো হচ্ছে
      const res = await fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ক্লিক করার পর সাকসেস মেসেজ শো করা (What Happens Next শর্তানুযায়ী)
        setMessage({ 
          type: 'success', 
          text: '🎉 Success! Tutor details along with your user information have been successfully stored into the database.' 
        });
        
        // ফর্ম ক্লিয়ার বা রিসেট করা
        setFormData({
          name: '', photo: '', subject: 'Mathematics', availableDays: '', 
          availableTime: '', hourlyFee: '', totalSlot: '', startDate: '', 
          institution: '', experience: '', location: '', teachingMode: 'Online'
        });

        // সফল হওয়ার ২.৫ সেকেন্ড পর ইউজারকে টিউটর লিস্ট বা ড্যাশবোর্ডে রিডাইরেক্ট করা
        setTimeout(() => router.push("/tutors"), 2500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server connection failed!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            Add New Tutor Slot
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Logged in as: <span className="text-emerald-500 font-semibold">{session?.user?.email}</span>
          </p>
        </div>

        {/* সাকসেস/এরর মেসেজ অ্যালার্ট */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50' 
              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* Tutor Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tutor Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Ahad Hossain" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Photo Link (ImgBB/Postimage) *</label>
              <input type="url" name="photo" required value={formData.photo} onChange={handleChange} placeholder="https://i.ibb.co/your-image.jpg" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject / Category *</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer">
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Days *</label>
              <input type="text" name="availableDays" required value={formData.availableDays} onChange={handleChange} placeholder="e.g. Sun - Thu" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Available Time Slot */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Time Slot *</label>
              <input type="text" name="availableTime" required value={formData.availableTime} onChange={handleChange} placeholder="e.g. 5:00 PM - 8:00 PM" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Hourly Fee */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hourly Fee (BDT) *</label>
              <input type="number" name="hourlyFee" required value={formData.hourlyFee} onChange={handleChange} placeholder="e.g. 500" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Total Slot */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Total Slot *</label>
              <input type="number" name="totalSlot" required value={formData.totalSlot} onChange={handleChange} placeholder="e.g. 5" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Session Start Date (Date Picker) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Session Start Date *</label>
              <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer" />
            </div>

            {/* Institution & Experience */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Institution & Experience</label>
              <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. Dhaka Polytechnic, 2 yrs exp" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location (Area/City) *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Mirpur, Dhaka" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            {/* Teaching Mode Dropdown */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teaching Mode *</label>
              <select name="teachingMode" value={formData.teachingMode} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 py-4 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? 'Storing Tutor Info...' : 'Submit Button'}
          </button>
        </form>

      </div>
    </div>
  );
}