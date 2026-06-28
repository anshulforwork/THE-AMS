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

export interface StorageAdapter {
  initialize(): Promise<void>;
  getDailyLogs(): Promise<DailyLog[]>;
  upsertDailyLog(log: DailyLog): Promise<void>;
  getSetup(): Promise<AppSetup>;
  updateSetup(setup: Partial<AppSetup>): Promise<void>;
  getCourses(): Promise<Course[]>;
  upsertCourse(course: Course): Promise<void>;
  deleteCourse(id: string): Promise<void>;
  getSkills(): Promise<Skill[]>;
  upsertSkill(skill: Skill): Promise<void>;
  getMilestones(): Promise<Milestone[]>;
  upsertMilestone(milestone: Milestone): Promise<void>;
  getReading(): Promise<ReadingBook[]>;
  upsertReading(book: ReadingBook): Promise<void>;
  getFinancePlan(): Promise<FinancePlanEntry[]>;
  upsertFinancePlan(entries: FinancePlanEntry[]): Promise<void>;
  getNetwork(): Promise<NetworkContact[]>;
  upsertNetworkContact(contact: NetworkContact): Promise<void>;
  deleteNetworkContact(id: string): Promise<void>;
  bulkImportDailyLogs(logs: DailyLog[]): Promise<void>;
  getHabits(): Promise<Habit[]>;
  upsertHabit(habit: Habit): Promise<void>;
  deleteHabit(id: string): Promise<void>;
  getHabitLogs(): Promise<HabitLog[]>;
  toggleHabitLog(habitId: string, date: string): Promise<boolean>;
  getGoals(): Promise<Goal[]>;
  upsertGoal(goal: Goal): Promise<void>;
  deleteGoal(id: string): Promise<void>;
  getBudgets(): Promise<BudgetCategory[]>;
  upsertBudget(budget: BudgetCategory): Promise<void>;
  deleteBudget(id: string): Promise<void>;
}
