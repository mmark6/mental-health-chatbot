/**
 * Data Transfer Objects (DTOs) and type definitions for the
 * Your Insights premium dashboard.
 *
 * These mirror the expected FastAPI backend response shapes.
 * When wiring to a real API, replace the mock data in
 * `usePremiumInsights` with actual fetch calls.
 */

/**
 * @typedef {Object} MoodTrendPoint
 * @property {string} date - ISO date string
 * @property {number} score - Mood score 1-5
 * @property {string} label - Human-readable label
 */

/**
 * @typedef {Object} InsightDataDTO
 * @property {number} averageMood - Average mood score for the period
 * @property {number} totalSessions - Total chat sessions
 * @property {number} streakDays - Positive interaction streak (days)
 * @property {number} checkInsCompleted - Number of mood check-ins
 * @property {MoodTrendPoint[]} moodTrend - Time-series mood data
 * @property {Object[]} conversationThemes - Most discussed themes
 * @property {string} conversationThemes[].theme - Theme name
 * @property {number} conversationThemes[].count - Mention count
 * @property {number} conversationThemes[].percentage - Percentage of total
 * @property {string[]} recommendations - AI-generated takeaways
 * @property {string} period - '7d' | '30d' | 'all'
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} FilterOption
 * @property {string} value - '7d' | '30d' | 'all'
 * @property {string} label - Display label
 */

export const FILTER_OPTIONS = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'all', label: 'All Time' },
];

export const DEFAULT_FILTER = '7d';

export const EMPTY_INSIGHT_DATA = {
  averageMood: 0,
  totalSessions: 0,
  streakDays: 0,
  checkInsCompleted: 0,
  moodTrend: [],
  conversationThemes: [],
  recommendations: [],
  period: DEFAULT_FILTER,
  updatedAt: new Date().toISOString(),
};
