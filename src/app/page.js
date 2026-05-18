export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <div className="text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300 mb-3">
          MediQueue
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Welcome to the Tutor Booking System. Explore available tutors and book your digital sessions efficiently.
        </p>
      </div>
    </main>
  );
}