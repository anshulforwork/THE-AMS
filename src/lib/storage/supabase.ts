import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_FINANCE_PLAN } from "../finance";
import {
  SEED_BUDGETS,
  SEED_COURSES,
  SEED_GOALS,
  SEED_HABITS,
  SEED_MILESTONES,
  SEED_READING,
  SEED_SKILLS,
} from "../seed-data";
import { parseNumber } from "../utils";
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

const T = {
  daily: "ams_daily_log",
  setup: "ams_setup",
  courses: "ams_courses",
  skills: "ams_skills",
  milestones: "ams_milestones",
  reading: "ams_reading",
  finance: "ams_finance_plan",
  network: "ams_network",
  habits: "ams_habits",
  habitLogs: "ams_habit_logs",
  goals: "ams_goals",
  budgets: "ams_budgets",
} as const;

const DEFAULT_SETUP: AppSetup = {
  name: "Anshul Sahu",
  monthlyIncome: 30000,
  udemyCost: 4800,
  monthlyBudget: 25000,
  savingsGoal: 100000,
};

export class SupabaseStorage implements StorageAdapter {
  private db: SupabaseClient;

  constructor() {
    this.db = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      { auth: { persistSession: false } }
    );
  }

  async initialize(): Promise<void> {
    // Seed tables that are empty
    await this.seedIfEmpty(T.setup, async () => {
      await this.db.from(T.setup).insert([
        { key: "name", value: DEFAULT_SETUP.name },
        { key: "monthly_income", value: String(DEFAULT_SETUP.monthlyIncome) },
        { key: "udemy_cost", value: String(DEFAULT_SETUP.udemyCost) },
        { key: "monthly_budget", value: String(DEFAULT_SETUP.monthlyBudget) },
        { key: "savings_goal", value: String(DEFAULT_SETUP.savingsGoal) },
      ]);
    });
    await this.seedIfEmpty(T.courses, () => this.db.from(T.courses).insert(SEED_COURSES.map(courseRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.skills, () => this.db.from(T.skills).insert(SEED_SKILLS.map(skillRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.milestones, () => this.db.from(T.milestones).insert(SEED_MILESTONES.map(milestoneRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.reading, () => this.db.from(T.reading).insert(SEED_READING.map(readingRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.finance, () => this.db.from(T.finance).insert(DEFAULT_FINANCE_PLAN.map((e) => ({ key: e.key, value: e.value, notes: e.notes }))) as unknown as Promise<void>);
    await this.seedIfEmpty(T.habits, () => this.db.from(T.habits).insert(SEED_HABITS.map(habitRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.goals, () => this.db.from(T.goals).insert(SEED_GOALS.map(goalRow)) as unknown as Promise<void>);
    await this.seedIfEmpty(T.budgets, () => this.db.from(T.budgets).insert(SEED_BUDGETS.map(budgetRow)) as unknown as Promise<void>);
  }

  private async seedIfEmpty(table: string, seed: () => Promise<unknown>): Promise<void> {
    const { count } = await this.db.from(table).select("*", { count: "exact", head: true });
    if (!count) await seed();
  }

  async getDailyLogs(): Promise<DailyLog[]> {
    const { data } = await this.db.from(T.daily).select("*").order("date");
    return (data ?? []).map(toDailyLog);
  }

  async upsertDailyLog(log: DailyLog): Promise<void> {
    await this.db.from(T.daily).upsert(dailyRow(log), { onConflict: "date" });
  }

  async getSetup(): Promise<AppSetup> {
    const { data } = await this.db.from(T.setup).select("*");
    const map: Record<string, string> = {};
    for (const r of data ?? []) map[r.key] = r.value;
    return {
      name: map.name ?? DEFAULT_SETUP.name,
      monthlyIncome: parseNumber(map.monthly_income, DEFAULT_SETUP.monthlyIncome),
      udemyCost: parseNumber(map.udemy_cost, DEFAULT_SETUP.udemyCost),
      monthlyBudget: parseNumber(map.monthly_budget, DEFAULT_SETUP.monthlyBudget),
      savingsGoal: parseNumber(map.savings_goal, DEFAULT_SETUP.savingsGoal),
    };
  }

  async updateSetup(setup: Partial<AppSetup>): Promise<void> {
    const current = await this.getSetup();
    const merged = { ...current, ...setup };
    await this.db.from(T.setup).upsert([
      { key: "name", value: merged.name },
      { key: "monthly_income", value: String(merged.monthlyIncome) },
      { key: "udemy_cost", value: String(merged.udemyCost) },
      { key: "monthly_budget", value: String(merged.monthlyBudget) },
      { key: "savings_goal", value: String(merged.savingsGoal) },
    ], { onConflict: "key" });
  }

  async getCourses(): Promise<Course[]> {
    const { data } = await this.db.from(T.courses).select("*");
    return (data ?? []).map(toCourse);
  }

  async upsertCourse(course: Course): Promise<void> {
    await this.db.from(T.courses).upsert(courseRow(course), { onConflict: "id" });
  }

  async deleteCourse(id: string): Promise<void> {
    await this.db.from(T.courses).delete().eq("id", id);
  }

  async getSkills(): Promise<Skill[]> {
    const { data } = await this.db.from(T.skills).select("*");
    return (data ?? []).map(toSkill);
  }

  async upsertSkill(skill: Skill): Promise<void> {
    await this.db.from(T.skills).upsert(skillRow(skill), { onConflict: "id" });
  }

  async getMilestones(): Promise<Milestone[]> {
    const { data } = await this.db.from(T.milestones).select("*");
    return (data ?? []).map(toMilestone);
  }

  async upsertMilestone(m: Milestone): Promise<void> {
    await this.db.from(T.milestones).upsert(milestoneRow(m), { onConflict: "id" });
  }

  async getReading(): Promise<ReadingBook[]> {
    const { data } = await this.db.from(T.reading).select("*");
    return (data ?? []).map(toReading);
  }

  async upsertReading(b: ReadingBook): Promise<void> {
    await this.db.from(T.reading).upsert(readingRow(b), { onConflict: "id" });
  }

  async getFinancePlan(): Promise<FinancePlanEntry[]> {
    const { data } = await this.db.from(T.finance).select("*");
    return (data ?? []).map((r) => ({ key: r.key, value: r.value, notes: r.notes ?? "" }));
  }

  async upsertFinancePlan(entries: FinancePlanEntry[]): Promise<void> {
    await this.db.from(T.finance).upsert(
      entries.map((e) => ({ key: e.key, value: e.value, notes: e.notes })),
      { onConflict: "key" }
    );
  }

  async getNetwork(): Promise<NetworkContact[]> {
    const { data } = await this.db.from(T.network).select("*");
    return (data ?? []).map(toNetwork);
  }

  async upsertNetworkContact(c: NetworkContact): Promise<void> {
    await this.db.from(T.network).upsert(networkRow(c), { onConflict: "id" });
  }

  async deleteNetworkContact(id: string): Promise<void> {
    await this.db.from(T.network).delete().eq("id", id);
  }

  async bulkImportDailyLogs(logs: DailyLog[]): Promise<void> {
    if (logs.length === 0) return;
    await this.db.from(T.daily).upsert(logs.map(dailyRow), { onConflict: "date" });
  }

  async getHabits(): Promise<Habit[]> {
    const { data } = await this.db.from(T.habits).select("*").eq("archived", false);
    return (data ?? []).map(toHabit);
  }

  async upsertHabit(habit: Habit): Promise<void> {
    await this.db.from(T.habits).upsert(habitRow(habit), { onConflict: "id" });
  }

  async deleteHabit(id: string): Promise<void> {
    await this.db.from(T.habitLogs).delete().eq("habit_id", id);
    await this.db.from(T.habits).delete().eq("id", id);
  }

  async getHabitLogs(): Promise<HabitLog[]> {
    const { data } = await this.db.from(T.habitLogs).select("*");
    return (data ?? []).map((r) => ({ habitId: r.habit_id, date: r.date }));
  }

  async toggleHabitLog(habitId: string, date: string): Promise<boolean> {
    const { data } = await this.db
      .from(T.habitLogs)
      .select("*")
      .eq("habit_id", habitId)
      .eq("date", date);
    if (data && data.length > 0) {
      await this.db.from(T.habitLogs).delete().eq("habit_id", habitId).eq("date", date);
      return false;
    }
    await this.db.from(T.habitLogs).insert({ habit_id: habitId, date });
    return true;
  }

  async getGoals(): Promise<Goal[]> {
    const { data } = await this.db.from(T.goals).select("*");
    return (data ?? []).map(toGoal);
  }

  async upsertGoal(goal: Goal): Promise<void> {
    await this.db.from(T.goals).upsert(goalRow(goal), { onConflict: "id" });
  }

  async deleteGoal(id: string): Promise<void> {
    await this.db.from(T.goals).delete().eq("id", id);
  }

  async getBudgets(): Promise<BudgetCategory[]> {
    const { data } = await this.db.from(T.budgets).select("*");
    return (data ?? []).map(toBudget);
  }

  async upsertBudget(budget: BudgetCategory): Promise<void> {
    await this.db.from(T.budgets).upsert(budgetRow(budget), { onConflict: "id" });
  }

  async deleteBudget(id: string): Promise<void> {
    await this.db.from(T.budgets).delete().eq("id", id);
  }
}

type Row = Record<string, unknown>;

function toDailyLog(r: Row): DailyLog {
  return {
    date: String(r.date),
    day: String(r.day ?? ""),
    learnHrs: parseNumber(r.learn_hrs),
    course: String(r.course ?? ""),
    expense: parseNumber(r.expense),
    category: String(r.category ?? ""),
    mood: parseNumber(r.mood),
    productivity: parseNumber(r.productivity),
    exercise: Boolean(r.exercise),
    journalDone: Boolean(r.journal_done),
    keyLearning: String(r.key_learning ?? ""),
    journalText: String(r.journal_text ?? ""),
    checkinTimestamp: String(r.checkin_timestamp ?? ""),
  };
}

function dailyRow(l: DailyLog): Row {
  return {
    date: l.date, day: l.day, learn_hrs: l.learnHrs, course: l.course,
    expense: l.expense, category: l.category, mood: l.mood,
    productivity: l.productivity, exercise: l.exercise,
    journal_done: l.journalDone, key_learning: l.keyLearning,
    journal_text: l.journalText, checkin_timestamp: l.checkinTimestamp,
  };
}

function toCourse(r: Row): Course {
  return {
    id: String(r.id), quarter: String(r.quarter ?? ""), track: String(r.track ?? ""),
    title: String(r.title ?? ""), url: String(r.url ?? ""), start: String(r.start ?? ""),
    end: String(r.end ?? ""), courseHrs: parseNumber(r.course_hrs),
    progressPct: parseNumber(r.progress_pct), status: String(r.status ?? "Not Started"),
    skill: String(r.skill ?? ""), roi: String(r.roi ?? ""),
  };
}

function courseRow(c: Course): Row {
  return {
    id: c.id, quarter: c.quarter, track: c.track, title: c.title, url: c.url,
    start: c.start, end: c.end, course_hrs: c.courseHrs, progress_pct: c.progressPct,
    status: c.status, skill: c.skill, roi: c.roi,
  };
}

function toBudget(r: Row): BudgetCategory {
  return { id: String(r.id), category: String(r.category ?? ""), budget: parseNumber(r.budget) };
}

function budgetRow(b: BudgetCategory): Row {
  return { id: b.id, category: b.category, budget: b.budget };
}

function toSkill(r: Row): Skill {
  return {
    id: String(r.id), skill: String(r.skill ?? ""), targetLevel: String(r.target_level ?? ""),
    currentPct: parseNumber(r.current_pct), targetQ: String(r.target_q ?? ""),
    selfRating: parseNumber(r.self_rating),
  };
}

function skillRow(s: Skill): Row {
  return {
    id: s.id, skill: s.skill, target_level: s.targetLevel, current_pct: s.currentPct,
    target_q: s.targetQ, self_rating: s.selfRating,
  };
}

function toMilestone(r: Row): Milestone {
  return {
    id: String(r.id), month: String(r.month ?? ""), deliverable: String(r.deliverable ?? ""),
    type: String(r.type ?? ""), status: String(r.status ?? "pending"),
    idxLink: String(r.idx_link ?? "NO"), notes: String(r.notes ?? ""),
  };
}

function milestoneRow(m: Milestone): Row {
  return {
    id: m.id, month: m.month, deliverable: m.deliverable, type: m.type,
    status: m.status, idx_link: m.idxLink, notes: m.notes,
  };
}

function toReading(r: Row): ReadingBook {
  return {
    id: String(r.id), book: String(r.book ?? ""), author: String(r.author ?? ""),
    totalPg: parseNumber(r.total_pg), targetPgWk: parseNumber(r.target_pg_wk),
    pagesRead: parseNumber(r.pages_read),
  };
}

function readingRow(b: ReadingBook): Row {
  return {
    id: b.id, book: b.book, author: b.author, total_pg: b.totalPg,
    target_pg_wk: b.targetPgWk, pages_read: b.pagesRead,
  };
}

function toNetwork(r: Row): NetworkContact {
  return {
    id: String(r.id), name: String(r.name ?? ""), relationship: String(r.relationship ?? ""),
    company: String(r.company ?? ""), role: String(r.role ?? ""), contact: String(r.contact ?? ""),
    lastContacted: String(r.last_contacted ?? ""), nextFollowup: String(r.next_followup ?? ""),
    importance: String(r.importance ?? "medium"), notes: String(r.notes ?? ""),
  };
}

function networkRow(c: NetworkContact): Row {
  return {
    id: c.id, name: c.name, relationship: c.relationship, company: c.company, role: c.role,
    contact: c.contact, last_contacted: c.lastContacted || null, next_followup: c.nextFollowup || null,
    importance: c.importance, notes: c.notes,
  };
}

function toHabit(r: Row): Habit {
  return {
    id: String(r.id), name: String(r.name ?? ""), icon: String(r.icon ?? "Circle"),
    color: String(r.color ?? "violet"), cadence: String(r.cadence ?? "daily"),
    createdAt: String(r.created_at ?? ""), archived: Boolean(r.archived),
  };
}

function habitRow(h: Habit): Row {
  return {
    id: h.id, name: h.name, icon: h.icon, color: h.color, cadence: h.cadence,
    created_at: h.createdAt, archived: h.archived,
  };
}

function toGoal(r: Row): Goal {
  return {
    id: String(r.id), title: String(r.title ?? ""), category: String(r.category ?? ""),
    target: parseNumber(r.target), current: parseNumber(r.current), unit: String(r.unit ?? ""),
    deadline: String(r.deadline ?? ""), status: String(r.status ?? "active"), notes: String(r.notes ?? ""),
  };
}

function goalRow(g: Goal): Row {
  return {
    id: g.id, title: g.title, category: g.category, target: g.target, current: g.current,
    unit: g.unit, deadline: g.deadline || null, status: g.status, notes: g.notes,
  };
}
