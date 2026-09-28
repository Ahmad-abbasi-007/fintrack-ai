import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CategoryManager from "@/components/CategoryManager";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const categories = (data ?? []) as Category[];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Categories 🏷️
          </h1>
          <p className="text-gray-400 mb-8">
            Manage your income and expense categories.
          </p>

          <CategoryManager categories={categories} />
        </main>
      </div>
    </div>
  );
}