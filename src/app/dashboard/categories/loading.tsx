import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { SkeletonList } from "@/components/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <div className="h-9 w-56 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-gray-800/60 rounded-lg mb-8 animate-pulse" />

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="h-6 w-44 bg-gray-800/60 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="h-10 bg-gray-800/60 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-800/60 rounded-lg animate-pulse" />
            </div>
            <div className="h-11 bg-gray-800/60 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonList rows={5} />
            <SkeletonList rows={5} />
          </div>
        </main>
      </div>
    </div>
  );
}