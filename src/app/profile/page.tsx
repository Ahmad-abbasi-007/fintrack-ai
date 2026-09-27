import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-2xl">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U")
                  .toString()
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-semibold">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Name" value={user.user_metadata?.full_name || "—"} />
              <Field label="Email" value={user.email || "—"} />
              <Field label="User ID" value={user.id} />
              <Field
                label="Joined"
                value={new Date(user.created_at).toLocaleDateString()}
              />
            </div>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400">
                ✏️ Editing profile & password change coming soon.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm break-all">{value}</p>
    </div>
  );
}