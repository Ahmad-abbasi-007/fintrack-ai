import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SettingsForm from "@/components/SettingsForm";
import { getUserSettings } from "@/app/dashboard/settings-actions";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const settings = await getUserSettings();

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
            <p className="text-gray-400">Loading settings...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Settings ⚙️
          </h1>
          <p className="text-gray-400 mb-8">
            Customize your FinTrack AI experience.
          </p>

          <SettingsForm initialSettings={settings} />
        </main>
      </div>
    </div>
  );
}