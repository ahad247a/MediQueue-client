import Banner from "@/components/Banner";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* ১. ব্যানার সেকশন */}
      <Banner />
      
      {/* এখানে পরবর্তীতে হোম পেইজের বাকি সেকশনগুলো আসবে */}
    </main>
  );
}