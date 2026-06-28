export const SHEET_TABS = {
  dailyLog: "app_daily_log",
  setup: "app_setup",
  courses: "app_courses",
  skills: "app_skills",
  milestones: "app_milestones",
  reading: "app_reading",
  financePlan: "app_finance_plan",
  network: "app_network",
} as const;

export const TAB_HEADERS: Record<string, string[]> = {
  [SHEET_TABS.dailyLog]: [
    "date", "day", "learn_hrs", "course", "expense", "category",
    "mood", "productivity", "exercise", "journal_done",
    "key_learning", "journal_text", "checkin_timestamp",
  ],
  [SHEET_TABS.setup]: ["key", "value"],
  [SHEET_TABS.courses]: [
    "id", "quarter", "track", "title", "url", "start", "end",
    "course_hrs", "progress_pct", "skill", "roi",
  ],
  [SHEET_TABS.skills]: [
    "id", "skill", "target_level", "current_pct", "target_q", "self_rating",
  ],
  [SHEET_TABS.milestones]: [
    "id", "month", "deliverable", "type", "status", "idx_link", "notes",
  ],
  [SHEET_TABS.reading]: [
    "id", "book", "author", "total_pg", "target_pg_wk", "pages_read",
  ],
  [SHEET_TABS.financePlan]: ["key", "value", "notes"],
  [SHEET_TABS.network]: [
    "id", "name", "relationship", "company", "role", "contact",
    "last_contacted", "next_followup", "importance", "notes",
  ],
};
