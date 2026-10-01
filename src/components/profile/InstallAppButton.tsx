"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppButton({
  label = "Install app",
  showPlatforms = false,
}: {
  label?: string;
  showPlatforms?: boolean;
}) {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  async function handleInstall(platform?: "android" | "apple") {
    if (platform === "apple") {
      setMessage(
        "On iPhone or iPad, open this page in Safari, tap Share, then choose Add to Home Screen."
      );
      return;
    }

    if (platform === "android" && !/android/i.test(navigator.userAgent)) {
      setMessage("Open FinTrack AI on an Android device to install the app.");
      return;
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      setMessage("FinTrack AI is already installed on this device.");
      return;
    }

    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        setMessage(
          outcome === "accepted"
            ? "FinTrack AI is being installed."
            : "Installation was cancelled."
        );
        setInstallPrompt(null);
      } catch {
        setMessage("Open your browser menu and choose Install app.");
      }
      return;
    }

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setMessage(
      platform === "android"
        ? "In Chrome, open the browser menu and choose Install app."
        : isIOS
          ? "In Safari, tap Share, then choose Add to Home Screen."
          : "Open your browser menu and choose Install app or Add to Home Screen."
    );
  }

  return (
    <div className={showPlatforms ? "relative" : undefined}>
      <button
        type="button"
        onClick={() =>
          showPlatforms
            ? setMenuOpen((isOpen) => !isOpen)
            : void handleInstall()
        }
        disabled={installed && !showPlatforms}
        aria-haspopup={showPlatforms ? "menu" : undefined}
        aria-expanded={showPlatforms ? menuOpen : undefined}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-300 text-black font-semibold px-3 sm:px-4 py-2.5 rounded-lg whitespace-nowrap"
      >
        {installed && !showPlatforms ? "App installed" : label}
      </button>
      {showPlatforms && menuOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-1 shadow-xl"
          role="menu"
          aria-label="Choose your device"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              void handleInstall("android");
            }}
            className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800"
          >
            Android app
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              void handleInstall("apple");
            }}
            className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-800"
          >
            Apple app
          </button>
        </div>
      )}
      {message && (
        <p
          className={
            showPlatforms
              ? "absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-800 bg-gray-900 p-3 text-left text-xs text-gray-300 shadow-xl"
              : "mt-3 text-sm text-gray-400"
          }
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}