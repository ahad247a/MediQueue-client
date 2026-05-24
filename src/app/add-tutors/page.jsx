'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddTutorsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [formData, setFormData] = useState({
    name: '',
    photo: '', 
    subject: 'Mathematics', 
    availableDays: '', 
    availableTime: '', 
    hourlyFee: '',
    totalSlot: '',
    startDate: '', 
    institution: '',
    experience: '',
    location: '', 
    teachingMode: 'Online' 
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        tutorEmail: session?.user?.email, 
        hourlyFee: Number(formData.hourlyFee), 
        totalSlot: Number(formData.totalSlot), 
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/my-tutors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Success! Tutor details have been successfully stored.');
        
        setFormData({
          name: '', photo: '', subject: 'Mathematics', availableDays: '', 
          availableTime: '', hourlyFee: '', totalSlot: '', startDate: '', 
          institution: '', experience: '', location: '', teachingMode: 'Online'
        });

        setTimeout(() => router.push("/tutors"), 2500);
      } else {
        toast.error(data.error || 'Failed to store tutor details. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error! Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            Add New Tutor Slot
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Logged in as: <span className="text-emerald-500 font-semibold">{session?.user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tutor Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Ahad Hossain" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Photo Link (ImgBB/Postimage) *</label>
              <input type="url" name="photo" required value={formData.photo} onChange={handleChange} placeholder="https://i.ibb.co/your-image.jpg" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject / Category *</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer">
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Days *</label>
              <input type="text" name="availableDays" required value={formData.availableDays} onChange={handleChange} placeholder="e.g. Sun - Thu" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Available Time Slot *</label>
              <input type="text" name="availableTime" required value={formData.availableTime} onChange={handleChange} placeholder="e.g. 5:00 PM - 8:00 PM" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Hourly Fee (BDT) *</label>
              <input type="number" name="hourlyFee" required value={formData.hourlyFee} onChange={handleChange} placeholder="e.g. 500" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Total Slot *</label>
              <input type="number" name="totalSlot" required value={formData.totalSlot} onChange={handleChange} placeholder="e.g. 5" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Session Start Date *</label>
              <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Institution & Experience</label>
              <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. Dhaka Polytechnic, 2 yrs exp" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location (Area/City) *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Mirpur, Dhaka" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teaching Mode *</label>
              <select name="teachingMode" value={formData.teachingMode} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 py-4 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? 'Storing Tutor Info...' : 'Submit Details'}
          </button>
        </form>

      </div>
    </div>
  );
}