import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SkeletonCard, SkeletonList } from "@/components/Skeleton";

export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="h-9 w-48 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-gray-800/60 rounded-lg mb-6 animate-pulse" />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-gray-800/60 rounded mb-2 animate-pulse" />
                  <div className="h-10 w-full bg-gray-800/60 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <SkeletonList rows={6} />
        </main>
      </div>
    </div>
  );
}