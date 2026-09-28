import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-8xl font-bold text-emerald-400 mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-gray-400 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}