import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AvatarUploader from "@/components/profile/AvatarUploader";
import EditableField from "@/components/profile/EditableField";
import DangerZone from "@/components/profile/DangerZone";
import {
  updateFullName,
  updateEmail,
  updatePassword,
} from "@/app/profile/actions";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user stats
  const [txnCount, goalCount, budgetCount] = await Promise.all([
    supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("goals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("budgets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysSince = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const fullName = user.user_metadata?.full_name || "User";
  const avatarUrl = user.user_metadata?.avatar_url || undefined;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Profile
          </h1>
          <p className="text-gray-400 mb-8">
            Manage your account, security, and personal data.
          </p>

          {/* Avatar + Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <AvatarUploader
              name={fullName}
              email={user.email || ""}
              currentUrl={avatarUrl}
            />

            <div className="border-t border-gray-800 pt-5 mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <EditableField
                label="Full Name"
                initialValue={fullName}
                onSave={updateFullName}
              />
              <EditableField
                label="Email"
                initialValue={user.email || ""}
                onSave={updateEmail}
                type="email"
                helpText="A confirmation link will be sent to the new email."
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Transactions"
              value={String(txnCount.count || 0)}
              icon="💸"
            />
            <StatCard
              label="Goals"
              value={String(goalCount.count || 0)}
              icon="🎯"
            />
            <StatCard
              label="Budgets"
              value={String(budgetCount.count || 0)}
              icon="💰"
            />
          </div>

          {/* Account Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-5">
              🔐 Security & Account
            </h3>

            <div className="space-y-5">
              <EditableField
                label="Change Password"
                initialValue=""
                onSave={updatePassword}
                type="password"
                helpText="Minimum 6 characters. You'll stay logged in on this device."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    User ID
                  </p>
                  <p className="text-sm break-all">{user.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Joined
                  </p>
                  <p className="text-sm">
                    {joinedDate}{" "}
                    <span className="text-gray-500 text-xs">
                      ({daysSince} days ago)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <DangerZone />
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xl font-bold text-emerald-400">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}