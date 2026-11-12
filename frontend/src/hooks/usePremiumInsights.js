import { useState, useCallback, useEffect } from 'react';
import {
  DEFAULT_FILTER,
  EMPTY_INSIGHT_DATA,
} from '../types/insights';

/**
 * Custom hook that provides premium insights data.
 *
 * Currently uses mock data with an artificial delay to simulate
 * a FastAPI backend call. Replace `fetchInsights` with a real
 * `fetch('http://127.0.0.1:8000/api/insights', ...)` call when
 * the backend endpoint is ready.
 *
 * @returns {Object}
 * @returns {Object} data - InsightDataDTO or empty shape while loading
 * @returns {boolean} loading
 * @returns {string|null} error
 * @returns {string} period - Active filter period
 * @returns {Function} setPeriod - Change the time period filter
 */
export function usePremiumInsights() {
  const [period, setActivePeriod] = useState(DEFAULT_FILTER);
  const [requestId, setRequestId] = useState(0);
  const [data, setData] = useState(EMPTY_INSIGHT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setPeriod = useCallback((nextPeriod) => {
    if (nextPeriod === period) return;
    setLoading(true);
    setError(null);
    setActivePeriod(nextPeriod);
  }, [period]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setRequestId((current) => current + 1);
  }, []);

  /**
   * Fetch insights from the backend (mocked here).
   * @param {string} periodValue - '7d' | '30d' | 'all'
   * @returns {Promise<void>}
   */
  const fetchInsights = useCallback(async (periodValue) => {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // TODO: Replace with real API call:
      // const res = await fetch(
      //   `http://127.0.0.1:8000/api/insights?period=${periodValue}`,
      //   { headers: { 'Content-Type': 'application/json' } }
      // );
      // if (!res.ok) throw new Error(`Insights API returned ${res.status}`);
      // const dto = await res.json();

      const dto = buildMockInsights(periodValue);
      setData(dto);
    } catch (err) {
      setError(err.message || 'Unable to load insights. Please try again.');
      setData(EMPTY_INSIGHT_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + refetch when period changes
  useEffect(() => {
    Promise.resolve().then(() => fetchInsights(period));
  }, [period, requestId, fetchInsights]);

  return { data, loading, error, period, setPeriod, refresh };
}

/**
 * Builds mock insight data for a given period.
 * @param {string} periodValue
 * @returns {Object} InsightDataDTO shape
 */
function buildMockInsights(periodValue) {
  const now = new Date();
  const days = periodValue === 'all' ? 90 : periodValue === '30d' ? 30 : 7;

  const moodTrend = [];
  let baseScore = 3.2;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Smooth, human-like variation rather than random jumps
    baseScore += (Math.random() - 0.5) * 0.4;
    baseScore = Math.min(5, Math.max(1, baseScore));
    moodTrend.push({
      date: d.toISOString().split('T')[0],
      score: Number(baseScore.toFixed(2)),
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }

  const averageMood =
    moodTrend.length > 0
      ? Number(
          (moodTrend.reduce((sum, p) => sum + p.score, 0) /
            moodTrend.length).toFixed(2)
        )
      : 0;

  const totalSessions = Math.floor(Math.random() * 12) + 8;
  const streakDays = Math.floor(Math.random() * 14) + 1;
  const checkInsCompleted = moodTrend.length;

  const conversationThemes = [
    { theme: 'Anxiety', count: 14, percentage: 28 },
    { theme: 'Relationships', count: 11, percentage: 22 },
    { theme: 'Work stress', count: 9, percentage: 18 },
    { theme: 'Sleep', count: 7, percentage: 14 },
    { theme: 'Self-esteem', count: 6, percentage: 12 },
    { theme: 'Grief', count: 3, percentage: 6 },
  ];

  const recommendations = [
    'Try a 5-minute breathing exercise when anxiety spikes.',
    'Schedule a short walk after work to ease stress.',
    'Write down three small wins each evening.',
    'Reach out to a trusted friend this week.',
    'Set a consistent bedtime routine for better sleep.',
  ];

  return {
    averageMood,
    totalSessions,
    streakDays,
    checkInsCompleted,
    moodTrend,
    conversationThemes,
    recommendations,
    period: periodValue,
    updatedAt: now.toISOString(),
  };
}
