"use client";

import { useState } from "react";
import {
  addCategory,
  deleteCategory,
  renameCategory,
} from "@/app/dashboard/category-actions";
import type { Category } from "@/lib/types";

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  async function handleAdd(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await addCategory(formData);
      setName("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(id: string) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("name", editValue);
    try {
      await renameCategory(formData);
      setEditingId(null);
      setEditValue("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to rename");
    }
  }

  async function handleDelete(id: string) {
    const formData = new FormData();
    formData.set("id", id);
    try {
      await deleteCategory(formData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      {/* Add new category */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`py-2 rounded-lg font-medium transition ${
              type === "income"
                ? "bg-emerald-500 text-black"
                : "bg-gray-950 text-gray-400 hover:text-white"
            }`}
          >
            📈 Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`py-2 rounded-lg font-medium transition ${
              type === "expense"
                ? "bg-red-500 text-white"
                : "bg-gray-950 text-gray-400 hover:text-white"
            }`}
          >
            📉 Expense
          </button>
        </div>

        <form action={handleAdd} className="flex gap-3">
          <input type="hidden" name="type" value={type} />
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Subscriptions, Pet care..."
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 rounded-lg disabled:opacity-50"
          >
            {loading ? "..." : "Add"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryList
          title="📈 Income Categories"
          categories={income}
          editingId={editingId}
          editValue={editValue}
          onEditStart={(cat) => {
            setEditingId(cat.id);
            setEditValue(cat.name);
          }}
          onEditChange={setEditValue}
          onEditSave={handleRename}
          onEditCancel={() => {
            setEditingId(null);
            setEditValue("");
          }}
          onDelete={handleDelete}
        />
        <CategoryList
          title="📉 Expense Categories"
          categories={expense}
          editingId={editingId}
          editValue={editValue}
          onEditStart={(cat) => {
            setEditingId(cat.id);
            setEditValue(cat.name);
          }}
          onEditChange={setEditValue}
          onEditSave={handleRename}
          onEditCancel={() => {
            setEditingId(null);
            setEditValue("");
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

function CategoryList({
  title,
  categories,
  editingId,
  editValue,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
}: {
  title: string;
  categories: Category[];
  editingId: string | null;
  editValue: string;
  onEditStart: (c: Category) => void;
  onEditChange: (v: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800">
        <h3 className="font-semibold">{title}</h3>
      </div>

      <ul className="divide-y divide-gray-800">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-gray-950/50"
          >
            {editingId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  autoFocus
                  className="flex-1 bg-gray-950 border border-emerald-500 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                />
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={() => onEditSave(cat.id)}
                    className="text-emerald-400 text-sm hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={onEditCancel}
                    className="text-gray-400 text-sm hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm">{cat.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => onEditStart(cat)}
                    className="text-gray-500 hover:text-emerald-400 text-xs"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(cat.id)}
                    className="text-gray-500 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="px-5 py-6 text-sm text-gray-500 text-center">
            No categories yet.
          </li>
        )}
      </ul>
    </div>
  );
}