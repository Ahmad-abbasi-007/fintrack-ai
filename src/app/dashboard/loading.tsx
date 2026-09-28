import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonList,
} from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="h-9 w-72 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-gray-800/60 rounded-lg mb-10 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>

          <SkeletonList rows={5} />
        </main>
      </div>
    </div>
  );
}