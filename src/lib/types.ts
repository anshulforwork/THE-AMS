export interface DailyLog {
  date: string;
  day: string;
  learnHrs: number;
  course: string;
  expense: number;
  category: string;
  mood: number;
  productivity: number;
  exercise: boolean;
  journalDone: boolean;
  keyLearning: string;
  journalText: string;
  checkinTimestamp: string;
}

export interface SetupEntry {
  key: string;
  value: string;
}

export interface AppSetup {
  name: string;
  monthlyIncome: number;
  udemyCost: number;
  monthlyBudget: number;
  savingsGoal: number;
}

export interface Course {
  id: string;
  quarter: string;
  track: string;
  title: string;
  url: string;
  start: string;
  end: string;
  courseHrs: number;
  progressPct: number;
  status: string;
  skill: string;
  roi: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  budget: number;
}

export interface Skill {
  id: string;
  skill: string;
  targetLevel: string;
  currentPct: number;
  targetQ: string;
  selfRating: number;
}

export interface Milestone {
  id: string;
  month: string;
  deliverable: string;
  type: string;
  status: string;
  idxLink: string;
  notes: string;
}

export interface ReadingBook {
  id: string;
  book: string;
  author: string;
  totalPg: number;
  targetPgWk: number;
  pagesRead: number;
}

export interface FinancePlanEntry {
  key: string;
  value: string;
  notes: string;
}

export interface NetworkContact {
  id: string;
  name: string;
  relationship: string;
  company: string;
  role: string;
  contact: string;
  lastContacted: string;
  nextFollowup: string;
  importance: string;
  notes: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  cadence: string;
  createdAt: string;
  archived: boolean;
}

export interface HabitLog {
  habitId: string;
  date: string;
}

export interface HabitWithStats extends Habit {
  current: number;
  longest: number;
  doneToday: boolean;
  last30: string[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: string;
  notes: string;
}

export interface StreakStats {
  current: number;
  longest: number;
  totalCheckins: number;
  heatmap: Record<string, number>;
}

export interface DashboardStats {
  monthlyIncome: number;
  totalSpent: number;
  savingsRate: number;
  totalLearnHrs: number;
  daysStudied: number;
  roiMultiple: number;
  avgMood: number;
  avgProductivity: number;
  exerciseDays: number;
  currentStreak: number;
  longestStreak: number;
  monthlySummary: MonthlySummary[];
}

export interface MonthlySummary {
  month: string;
  learnHrs: number;
  daysStudied: number;
  expense: number;
  moodAvg: number;
  prodAvg: number;
  streak: number;
}
