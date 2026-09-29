"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "@/app/dashboard/settings-actions";
import { useTheme } from "@/components/ThemeProvider";
import { CURRENCIES } from "@/lib/currency";
import type { UserSettings } from "@/lib/types";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: UserSettings;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [theme, setThemeLocal] = useState(initialSettings.theme);
  const [currency, setCurrency] = useState(initialSettings.currency);
  const [budgetAlerts, setBudgetAlerts] = useState(
    initialSettings.budget_alerts
  );
  const [recurringReminders, setRecurringReminders] = useState(
    initialSettings.recurring_reminders
  );

  function handleSave() {
    setError("");
    setSaved(false);

    startSave(async () => {
      try {
        const fd = new FormData();
        fd.set("theme", theme);
        fd.set("currency", currency);
        if (budgetAlerts) fd.set("budget_alerts", "on");
        if (recurringReminders) fd.set("recurring_reminders", "on");

        await updateSettings(fd);
        setTheme(theme);
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🎨 Appearance</h3>

        <label className="block text-sm text-gray-400 mb-2">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {(["dark", "light", "system"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setThemeLocal(t)}
              className={`py-3 rounded-xl border text-sm font-medium capitalize transition ${
                theme === t
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-gray-800 hover:border-gray-700 text-gray-300"
              }`}
            >
              {t === "dark" ? "🌙 Dark" : t === "light" ? "☀️ Light" : "💻 System"}
            </button>
          ))}
        </div>
      </section>

      {/* Currency */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Currency</h3>

        <label className="block text-sm text-gray-400 mb-2">
          Display Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
        >
          {Object.values(CURRENCIES).map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code} — {c.label}
            </option>
          ))}
        </select>
      </section>

      {/* Notifications */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🔔 Notifications</h3>

        <div className="space-y-4">
          <Toggle
            label="Budget alerts"
            description="Get notified when you approach or exceed a budget."
            checked={budgetAlerts}
            onChange={setBudgetAlerts}
          />
          <Toggle
            label="Recurring reminders"
            description="Reminders for upcoming recurring transactions."
            checked={recurringReminders}
            onChange={setRecurringReminders}
          />
        </div>
      </section>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          ✅ Settings saved successfully
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}