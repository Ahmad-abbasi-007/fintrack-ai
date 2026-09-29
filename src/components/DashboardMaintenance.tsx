"use client";

import { startTransition, useEffect } from "react";
import { generateNotifications } from "@/app/dashboard/notification-actions";
import { generateDueRecurring } from "@/app/dashboard/recurring-actions";

export default function DashboardMaintenance() {
  useEffect(() => {
    startTransition(async () => {
      try {
        await generateDueRecurring();
      } catch (error) {
        console.error("Could not generate due recurring transactions", error);
      }

      try {
        await generateNotifications();
      } catch (error) {
        console.error("Could not generate dashboard notifications", error);
      }
    });
  }, []);

  return null;
}