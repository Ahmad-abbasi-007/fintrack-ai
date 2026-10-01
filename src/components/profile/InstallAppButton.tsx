"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
      setMessage("FinTrack AI is installed on this device.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      setMessage("FinTrack AI is already installed on this device.");
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setMessage(
        outcome === "accepted"
          ? "FinTrack AI is being installed."
          : "Installation was cancelled."
      );
      setInstallPrompt(null);
      return;
    }

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setMessage(
      isIOS
        ? "In Safari, tap Share, then choose Add to Home Screen."
        : "Open your browser menu and choose Install app or Add to Home Screen."
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleInstall}
        disabled={installed}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-300 text-black font-semibold px-4 py-2.5 rounded-lg"
      >
        {installed ? "App installed" : "Install app"}
      </button>
      {message && (
        <p className="mt-3 text-sm text-gray-400" role="status">
          {message}
        </p>
      )}
    </div>
  );
}