'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBookOpen, FiClock, FiStar, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

export default function TutorCard({ tutor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
     
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <Image
            src={tutor.image}
            alt={tutor.name}
            width={400}  
            height={200} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {tutor.subject}
          </span>
        </div>

      
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {tutor.name}
            </h3>
            <div className="flex items-center space-x-1 text-amber-500 text-sm font-semibold">
              <FiStar className="fill-amber-500 h-4 w-4" />
              <span>{tutor.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {tutor.qualification}
          </p>
        </div>

      
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3 my-4 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <FiClock className="text-emerald-500 h-4 w-4" />
            <span>{tutor.experience} Experience</span>
          </div>
          <div className="flex items-center space-x-1.5 justify-end">
            <FiBookOpen className="text-emerald-500 h-4 w-4" />
            <span>{tutor.totalSessions} Sessions</span>
          </div>
        </div>
      </div>

      
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Hourly Rate</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">${tutor.price}</span>
        </div>
        
        
        <Link
          href={`/tutors/${tutor._id || tutor.id}`}
          className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-500 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 group/btn"
        >
          <span>Book Session</span>
          <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}