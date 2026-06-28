import fs from "fs/promises";
import path from "path";
import { DEFAULT_FINANCE_PLAN } from "../finance";
import {
  SEED_BUDGETS, SEED_COURSES, SEED_GOALS, SEED_HABITS,
  SEED_MILESTONES, SEED_READING, SEED_SKILLS,
} from "../seed-data";
import { calculateStreak } from "../streak";
import type {
  AppSetup,
  BudgetCategory,
  Course,
  DailyLog,
  FinancePlanEntry,
  Goal,
  Habit,
  HabitLog,
  Milestone,
  NetworkContact,
  ReadingBook,
  Skill,
} from "../types";
import type { StorageAdapter } from "./types";

interface StoreData {
  dailyLogs: DailyLog[];
  setup: AppSetup;
  courses: Course[];
  skills: Skill[];
  milestones: Milestone[];
  reading: ReadingBook[];
  financePlan: FinancePlanEntry[];
  network: NetworkContact[];
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  budgets: BudgetCategory[];
}

const DEFAULT_SETUP: AppSetup = {
  name: "Anshul Sahu",
  monthlyIncome: 30000,
  udemyCost: 4800,
  monthlyBudget: 25000,
  savingsGoal: 100000,
};

function defaults(): StoreData {
  return {
    dailyLogs: [],
    setup: DEFAULT_SETUP,
    courses: SEED_COURSES,
    skills: SEED_SKILLS,
    milestones: SEED_MILESTONES,
    reading: SEED_READING,
    financePlan: DEFAULT_FINANCE_PLAN,
    network: [],
    habits: SEED_HABITS,
    habitLogs: [],
    goals: SEED_GOALS,
    budgets: SEED_BUDGETS,
  };
}

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

async function readStore(): Promise<StoreData> {
  const base = defaults();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    // Merge so missing keys fall back to defaults (prevents undefined arrays)
    return {
      dailyLogs: parsed.dailyLogs ?? base.dailyLogs,
      setup: { ...base.setup, ...(parsed.setup ?? {}) },
      courses: parsed.courses?.length ? parsed.courses : base.courses,
      skills: parsed.skills?.length ? parsed.skills : base.skills,
      milestones: parsed.milestones?.length ? parsed.milestones : base.milestones,
      reading: parsed.reading?.length ? parsed.reading : base.reading,
      financePlan: parsed.financePlan?.length ? parsed.financePlan : base.financePlan,
      network: parsed.network ?? base.network,
      habits: parsed.habits?.length ? parsed.habits : base.habits,
      habitLogs: parsed.habitLogs ?? base.habitLogs,
      goals: parsed.goals?.length ? parsed.goals : base.goals,
      budgets: parsed.budgets?.length ? parsed.budgets : base.budgets,
    };
  } catch {
    return base;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2));
}

export class LocalStorage implements StorageAdapter {
  async initialize(): Promise<void> {
    const store = await readStore();
    await writeStore(store);
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    const store = await readStore();
    return store.dailyLogs.sort((a, b) => a.date.localeCompare(b.date));
  }

  async upsertDailyLog(log: DailyLog): Promise<void> {
    const store = await readStore();
    const idx = store.dailyLogs.findIndex((l) => l.date === log.date);
    if (idx >= 0) store.dailyLogs[idx] = log;
    else store.dailyLogs.push(log);
    await writeStore(store);
  }

  async getSetup(): Promise<AppSetup> {
    return (await readStore()).setup;
  }

  async updateSetup(setup: Partial<AppSetup>): Promise<void> {
    const store = await readStore();
    store.setup = { ...store.setup, ...setup };
    await writeStore(store);
  }

  async getCourses(): Promise<Course[]> {
    return (await readStore()).courses;
  }

  async upsertCourse(course: Course): Promise<void> {
    const store = await readStore();
    const idx = store.courses.findIndex((c) => c.id === course.id);
    if (idx >= 0) store.courses[idx] = course;
    else store.courses.push(course);
    await writeStore(store);
  }

  async deleteCourse(id: string): Promise<void> {
    const store = await readStore();
    store.courses = store.courses.filter((c) => c.id !== id);
    await writeStore(store);
  }

  async getSkills(): Promise<Skill[]> {
    return (await readStore()).skills;
  }

  async upsertSkill(skill: Skill): Promise<void> {
    const store = await readStore();
    const idx = store.skills.findIndex((s) => s.id === skill.id);
    if (idx >= 0) store.skills[idx] = skill;
    else store.skills.push(skill);
    await writeStore(store);
  }

  async getMilestones(): Promise<Milestone[]> {
    return (await readStore()).milestones;
  }

  async upsertMilestone(milestone: Milestone): Promise<void> {
    const store = await readStore();
    const idx = store.milestones.findIndex((m) => m.id === milestone.id);
    if (idx >= 0) store.milestones[idx] = milestone;
    else store.milestones.push(milestone);
    await writeStore(store);
  }

  async getReading(): Promise<ReadingBook[]> {
    return (await readStore()).reading;
  }

  async upsertReading(book: ReadingBook): Promise<void> {
    const store = await readStore();
    const idx = store.reading.findIndex((b) => b.id === book.id);
    if (idx >= 0) store.reading[idx] = book;
    else store.reading.push(book);
    await writeStore(store);
  }

  async getFinancePlan(): Promise<FinancePlanEntry[]> {
    return (await readStore()).financePlan;
  }

  async upsertFinancePlan(entries: FinancePlanEntry[]): Promise<void> {
    const store = await readStore();
    store.financePlan = entries;
    await writeStore(store);
  }

  async getNetwork(): Promise<NetworkContact[]> {
    return (await readStore()).network;
  }

  async upsertNetworkContact(contact: NetworkContact): Promise<void> {
    const store = await readStore();
    const idx = store.network.findIndex((c) => c.id === contact.id);
    if (idx >= 0) store.network[idx] = contact;
    else store.network.push(contact);
    await writeStore(store);
  }

  async deleteNetworkContact(id: string): Promise<void> {
    const store = await readStore();
    store.network = store.network.filter((c) => c.id !== id);
    await writeStore(store);
  }

  async bulkImportDailyLogs(logs: DailyLog[]): Promise<void> {
    const store = await readStore();
    for (const log of logs) {
      const idx = store.dailyLogs.findIndex((l) => l.date === log.date);
      if (idx >= 0) store.dailyLogs[idx] = log;
      else store.dailyLogs.push(log);
    }
    await writeStore(store);
  }

  async getHabits(): Promise<Habit[]> {
    return (await readStore()).habits.filter((h) => !h.archived);
  }

  async upsertHabit(habit: Habit): Promise<void> {
    const store = await readStore();
    const idx = store.habits.findIndex((h) => h.id === habit.id);
    if (idx >= 0) store.habits[idx] = habit;
    else store.habits.push(habit);
    await writeStore(store);
  }

  async deleteHabit(id: string): Promise<void> {
    const store = await readStore();
    store.habits = store.habits.filter((h) => h.id !== id);
    store.habitLogs = store.habitLogs.filter((l) => l.habitId !== id);
    await writeStore(store);
  }

  async getHabitLogs(): Promise<HabitLog[]> {
    return (await readStore()).habitLogs;
  }

  async toggleHabitLog(habitId: string, date: string): Promise<boolean> {
    const store = await readStore();
    const idx = store.habitLogs.findIndex((l) => l.habitId === habitId && l.date === date);
    let done: boolean;
    if (idx >= 0) {
      store.habitLogs.splice(idx, 1);
      done = false;
    } else {
      store.habitLogs.push({ habitId, date });
      done = true;
    }
    await writeStore(store);
    return done;
  }

  async getGoals(): Promise<Goal[]> {
    return (await readStore()).goals;
  }

  async upsertGoal(goal: Goal): Promise<void> {
    const store = await readStore();
    const idx = store.goals.findIndex((g) => g.id === goal.id);
    if (idx >= 0) store.goals[idx] = goal;
    else store.goals.push(goal);
    await writeStore(store);
  }

  async deleteGoal(id: string): Promise<void> {
    const store = await readStore();
    store.goals = store.goals.filter((g) => g.id !== id);
    await writeStore(store);
  }

  async getBudgets(): Promise<BudgetCategory[]> {
    return (await readStore()).budgets;
  }

  async upsertBudget(budget: BudgetCategory): Promise<void> {
    const store = await readStore();
    const idx = store.budgets.findIndex((b) => b.id === budget.id);
    if (idx >= 0) store.budgets[idx] = budget;
    else store.budgets.push(budget);
    await writeStore(store);
  }

  async deleteBudget(id: string): Promise<void> {
    const store = await readStore();
    store.budgets = store.budgets.filter((b) => b.id !== id);
    await writeStore(store);
  }
}

// re-export for habit stat computation used elsewhere
export { calculateStreak };
