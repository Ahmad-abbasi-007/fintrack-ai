import type { Goal } from "@/lib/types";

export type GoalStatus = {
  goal: Goal;
  percent: number;
  remaining: number;
  daysLeft: number | null;
  monthlyNeeded: number | null;
  state: "new" | "progress" | "near" | "completed";
};

export function getGoalStatus(goal: Goal): GoalStatus {
  const target = Number(goal.target_amount);
  const saved = Number(goal.saved_amount);
  const remaining = Math.max(target - saved, 0);
  const percent = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

  let daysLeft: number | null = null;
  let monthlyNeeded: number | null = null;

  if (goal.deadline) {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const msPerDay = 1000 * 60 * 60 * 24;
    daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / msPerDay);

    if (daysLeft > 0 && remaining > 0) {
      const months = daysLeft / 30;
      monthlyNeeded = months > 0 ? remaining / months : remaining;
    }
  }

  let state: GoalStatus["state"] = "new";
  if (goal.is_completed || percent >= 100) state = "completed";
  else if (percent >= 80) state = "near";
  else if (percent > 0) state = "progress";

  return {
    goal,
    percent,
    remaining,
    daysLeft,
    monthlyNeeded,
    state,
  };
}

export function getGoalSummary(goals: Goal[]) {
  const active = goals.filter((g) => !g.is_completed);
  const totalTarget = goals.reduce(
    (s, g) => s + Number(g.target_amount),
    0
  );
  const totalSaved = goals.reduce(
    (s, g) => s + Number(g.saved_amount),
    0
  );
  const completed = goals.filter((g) => g.is_completed).length;

  return { active: active.length, totalTarget, totalSaved, completed };
}