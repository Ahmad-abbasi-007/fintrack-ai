import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function RecurringLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="h-9 w-80 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-gray-800/60 rounded-lg mb-6 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800/60 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-1/2 bg-gray-800/60 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-1/3 bg-gray-800/60 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-16 bg-gray-800/60 rounded-lg mb-3 animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-gray-800/60 rounded-lg animate-pulse" />
                  <div className="h-8 bg-gray-800/60 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}