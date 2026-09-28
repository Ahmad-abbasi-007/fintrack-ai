import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SkeletonCard, SkeletonList } from "@/components/Skeleton";

export default function BudgetsLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="h-9 w-64 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-80 bg-gray-800/60 rounded-lg mb-8 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <SkeletonList rows={4} />
        </main>
      </div>
    </div>
  );
}