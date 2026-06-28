import { generateId } from "./utils";
import type { BudgetCategory, Course, Goal, Habit, Milestone, ReadingBook, Skill } from "./types";

export const SEED_COURSES: Course[] = [
  { id: generateId(), quarter: "Q1", track: "PLC", title: "PLC Programming – Structured Patterns & Design", url: "https://www.udemy.com/course/plc-programming-structured-programming-and-design-patterns/", start: "2026-06", end: "2026-07", courseHrs: 12, progressPct: 5, status: "Not Started", skill: "IEC 61131-3, CoDeSys, Modular PLC", roi: "Industrial automation jobs: ₹8-15L/yr" },
  { id: generateId(), quarter: "Q1", track: "SCADA", title: "Ignition SCADA & HMI – Zero to Real PLC", url: "https://www.udemy.com/course/ignition-scada-hmi-complete-course-from-zero-to-real-plc/", start: "2026-07", end: "2026-08", courseHrs: 15, progressPct: 0, status: "Not Started", skill: "Ignition Gateway, OPC-UA, Historian, HMI", roi: "SCADA Engineers: ₹10-18L/yr" },
  { id: generateId(), quarter: "Q1", track: "Comm.", title: "Industrial Networking: Modbus, MQTT, OPC-UA", url: "https://www.udemy.com/course/industrial-internet-of-things/", start: "2026-08", end: "2026-09", courseHrs: 10, progressPct: 0, status: "Not Started", skill: "Modbus TCP/RTU, MQTT, OPC-UA arch", roi: "Bridges to IIoT roles: ₹12-20L/yr" },
  { id: generateId(), quarter: "Q2", track: "STM32", title: "Advanced Embedded: STM32 + FreeRTOS + Modbus", url: "https://www.udemy.com/course/advanced-embedded-software-with-stm32-freertos-modbus/", start: "2026-09", end: "2026-10", courseHrs: 20, progressPct: 0, status: "Not Started", skill: "STM32 HAL, FreeRTOS, Modbus driver", roi: "Embedded Systems: ₹10-20L/yr" },
  { id: generateId(), quarter: "Q2", track: "FreeRTOS", title: "Mastering RTOS Hands-on – FreeRTOS + STM32", url: "https://www.udemy.com/course/mastering-freertos/", start: "2026-10", end: "2026-11", courseHrs: 18, progressPct: 0, status: "Not Started", skill: "Tasks, queues, semaphores, scheduling", roi: "Safety-critical embedded: ₹15-25L/yr" },
  { id: generateId(), quarter: "Q3", track: "Python", title: "Python for Data Analysis – Pandas, NumPy, FastAPI", url: "https://www.udemy.com/course/data-analysis-with-pandas/", start: "2026-12", end: "2027-01", courseHrs: 14, progressPct: 0, status: "Not Started", skill: "Pandas, NumPy, REST API, SQL", roi: "EMS data engineering: ₹12-22L/yr" },
  { id: generateId(), quarter: "Q3", track: "EMS/BESS", title: "Battery Energy Storage & EMS Architecture", url: "https://www.udemy.com/course/battery-energy-storage-systems/", start: "2027-01", end: "2027-02", courseHrs: 8, progressPct: 0, status: "Not Started", skill: "BESS, PCS, BMS, Peak shaving, TOU", roi: "Energy storage niche: ₹18-35L/yr" },
  { id: generateId(), quarter: "Q4", track: "Cloud/IIoT", title: "AWS IoT Core + MQTT – Industrial IoT Master", url: "https://www.udemy.com/course/aws-iot/", start: "2027-03", end: "2027-04", courseHrs: 12, progressPct: 0, status: "Not Started", skill: "AWS IoT, MQTT broker, cloud telemetry", roi: "IIoT Architect: ₹20-40L/yr" },
  { id: generateId(), quarter: "Q4", track: "Architecture", title: "Software Architecture & Clean Code Principles", url: "https://www.udemy.com/course/software-architecture-design-of-modern-large-scale-systems/", start: "2027-04", end: "2027-05", courseHrs: 10, progressPct: 0, status: "Not Started", skill: "Layered arch, event-driven, microservices", roi: "Tech Lead path: ₹25-50L/yr" },
  { id: generateId(), quarter: "Q1", track: "SCADA", title: "Learn SCADA from Scratch - Design, Program and Interface", url: "", start: "2026-06", end: "", courseHrs: 10, progressPct: 0, status: "In Progress", skill: "SCADA fundamentals, HMI design", roi: "Automation roles" },
];

export const SEED_SKILLS: Skill[] = [
  { id: generateId(), skill: "PLC / IEC 61131-3", targetLevel: "Advanced", currentPct: 0, targetQ: "Q1", selfRating: 0 },
  { id: generateId(), skill: "SCADA / Ignition", targetLevel: "Advanced", currentPct: 0, targetQ: "Q1", selfRating: 0 },
  { id: generateId(), skill: "Modbus RTU+TCP", targetLevel: "Expert", currentPct: 50, targetQ: "Q1", selfRating: 0 },
  { id: generateId(), skill: "CAN Bus", targetLevel: "Expert", currentPct: 50, targetQ: "Q1", selfRating: 0 },
  { id: generateId(), skill: "STM32 Embedded", targetLevel: "Advanced", currentPct: 40, targetQ: "Q2", selfRating: 0 },
  { id: generateId(), skill: "FreeRTOS", targetLevel: "Advanced", currentPct: 10, targetQ: "Q2", selfRating: 0 },
  { id: generateId(), skill: "Embedded Architecture", targetLevel: "Advanced", currentPct: 20, targetQ: "Q2", selfRating: 0 },
  { id: generateId(), skill: "Python + FastAPI", targetLevel: "Intermediate", currentPct: 0, targetQ: "Q3", selfRating: 0 },
  { id: generateId(), skill: "BESS / EMS Theory", targetLevel: "Advanced", currentPct: 10, targetQ: "Q3", selfRating: 0 },
  { id: generateId(), skill: "SQL + Time-Series DB", targetLevel: "Intermediate", currentPct: 0, targetQ: "Q3", selfRating: 0 },
  { id: generateId(), skill: "Load Forecasting", targetLevel: "Intermediate", currentPct: 0, targetQ: "Q3", selfRating: 0 },
  { id: generateId(), skill: "AWS IoT / IIoT", targetLevel: "Architect", currentPct: 0, targetQ: "Q4", selfRating: 0 },
  { id: generateId(), skill: "System Architecture", targetLevel: "Intermediate", currentPct: 10, targetQ: "Q4", selfRating: 0 },
];

export const SEED_MILESTONES: Milestone[] = [
  { id: generateId(), month: "M1", deliverable: "Motor Starter + Conveyor + Tank Logic (3 programs)", type: "Code", status: "pending", idxLink: "NO", notes: "Udemy PLC course projects" },
  { id: generateId(), month: "M2", deliverable: "Energy Dashboard + Alarm Page + Trend Viewer", type: "Project", status: "pending", idxLink: "NO", notes: "Ignition SCADA course capstone" },
  { id: generateId(), month: "M3", deliverable: "Energy Monitor System V1 (PLC+SCADA+Modbus)", type: "CAPSTONE", status: "pending", idxLink: "YES", notes: "iDEX EMS stack proof-of-concept" },
  { id: generateId(), month: "M4", deliverable: "UART + SPI + CAN + Modbus Stack drivers", type: "Code", status: "pending", idxLink: "NO", notes: "STM32 course deliverables" },
  { id: generateId(), month: "M5", deliverable: "Multi-task sensor + CAN + Data Logger + Watchdog", type: "Code", status: "pending", idxLink: "NO", notes: "RTOS course capstone" },
  { id: generateId(), month: "M6", deliverable: "BMS Simulator: CAN+RTOS+SOC+Fault Handling", type: "CAPSTONE", status: "pending", idxLink: "YES", notes: "iDEX: OXTO KESS BMS reference" },
  { id: generateId(), month: "M7", deliverable: "100-page EMS Knowledge Base (personal notes)", type: "Docs", status: "pending", idxLink: "YES", notes: "BESS, PCS, BMS, Grid interaction" },
  { id: generateId(), month: "M8", deliverable: "Modbus Collector + Historian DB (PostgreSQL)", type: "Code", status: "pending", idxLink: "YES", notes: "Data pipeline for EMS" },
  { id: generateId(), month: "M9", deliverable: "REST APIs for EMS data + 24-hr Load Forecast", type: "Code", status: "pending", idxLink: "YES", notes: "Regression model for load prediction" },
  { id: generateId(), month: "M10", deliverable: "EMS Core Engine: Peak Shave + TOU + Dispatch", type: "CAPSTONE", status: "pending", idxLink: "YES", notes: "iDEX: KESS EMS algorithm demo" },
  { id: generateId(), month: "M11", deliverable: "Virtual BESS + Hardware-In-Loop Simulation", type: "Project", status: "pending", idxLink: "YES", notes: "iDEX: simulation layer" },
  { id: generateId(), month: "M12", deliverable: "INDUSTRIAL EMS PLATFORM (Field→SCADA→Cloud)", type: "CAPSTONE", status: "pending", idxLink: "YES", notes: "Full iDEX submission deliverable" },
];

const now = new Date().toISOString();
export const SEED_HABITS: Habit[] = [
  { id: generateId(), name: "Study / Learn", icon: "BookOpen", color: "violet", cadence: "daily", createdAt: now, archived: false },
  { id: generateId(), name: "Exercise", icon: "Dumbbell", color: "emerald", cadence: "daily", createdAt: now, archived: false },
  { id: generateId(), name: "Journal", icon: "PenLine", color: "amber", cadence: "daily", createdAt: now, archived: false },
  { id: generateId(), name: "No impulse spending", icon: "Wallet", color: "blue", cadence: "daily", createdAt: now, archived: false },
  { id: generateId(), name: "Sleep 7+ hrs", icon: "Moon", color: "indigo", cadence: "daily", createdAt: now, archived: false },
];

export const SEED_READING: ReadingBook[] = [
  { id: generateId(), book: "Making Embedded Systems", author: "Elecia White", totalPg: 300, targetPgWk: 20, pagesRead: 0 },
  { id: generateId(), book: "Clean Architecture", author: "Robert C. Martin", totalPg: 432, targetPgWk: 10, pagesRead: 0 },
  { id: generateId(), book: "Designing Data-Intensive Applications", author: "Martin Kleppmann", totalPg: 562, targetPgWk: 10, pagesRead: 0 },
];

export const SEED_BUDGETS: BudgetCategory[] = [
  { id: generateId(), category: "FOOD", budget: 4000 },
  { id: generateId(), category: "Rent", budget: 2300 },
  { id: generateId(), category: "Transport", budget: 1000 },
  { id: generateId(), category: "Bills", budget: 500 },
  { id: generateId(), category: "Fun", budget: 500 },
  { id: generateId(), category: "Skill Dev", budget: 600 },
  { id: generateId(), category: "Investment", budget: 15000 },
  { id: generateId(), category: "Emergency", budget: 5000 },
  { id: generateId(), category: "other", budget: 800 },
];

export const SEED_GOALS: Goal[] = [
  { id: generateId(), title: "Emergency Fund (6 months)", category: "Finance", target: 50000, current: 30000, unit: "₹", deadline: "2026-12-31", status: "active", notes: "6-month safety net" },
  { id: generateId(), title: "Investment Portfolio", category: "Finance", target: 100000, current: 32340, unit: "₹", deadline: "2027-05-31", status: "active", notes: "Long-term wealth" },
  { id: generateId(), title: "Annual Savings Goal", category: "Finance", target: 100000, current: 0, unit: "₹", deadline: "2027-05-31", status: "active", notes: "Target savings this year" },
  { id: generateId(), title: "Complete Udemy courses", category: "Learning", target: 10, current: 1, unit: "", deadline: "2027-05-31", status: "active", notes: "9-course EMS mastery plan" },
  { id: generateId(), title: "Learn Automation & SCADA deeply", category: "Career", target: 500, current: 53, unit: "hrs", deadline: "2027-05-31", status: "active", notes: "Core skill focus" },
  { id: generateId(), title: "Exercise regularly", category: "Health", target: 200, current: 0, unit: "days", deadline: "2027-05-31", status: "active", notes: "Consistency over intensity" },
  { id: generateId(), title: "Build 5 projects", category: "Career", target: 5, current: 0, unit: "", deadline: "2027-05-31", status: "active", notes: "Portfolio for iDEX" },
  { id: generateId(), title: "Read 12 books", category: "Learning", target: 12, current: 1, unit: "", deadline: "2027-05-31", status: "active", notes: "1 book/month" },
  { id: generateId(), title: "Get salary raise / freelance", category: "Career", target: 50000, current: 0, unit: "₹", deadline: "2027-05-31", status: "active", notes: "40% hike target" },
];
