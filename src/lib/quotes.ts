export const QUOTES: { text: string; author: string }[] = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Proverb" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "A river cuts through rock not because of its power, but its persistence.", author: "Jim Watkins" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
];

/** Deterministic quote-of-the-day based on date so it's stable within a day */
export function quoteOfTheDay(date = new Date()): { text: string; author: string } {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  return QUOTES[dayNumber % QUOTES.length];
}
