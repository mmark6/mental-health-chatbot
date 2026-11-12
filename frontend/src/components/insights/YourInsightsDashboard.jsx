import { useMemo, useCallback } from 'react';
import { usePremiumInsights } from '../../hooks/usePremiumInsights';
import { FILTER_OPTIONS } from '../../types/insights';
import KPICard from './KPICard';
import MoodTrendChart from './MoodTrendChart';
import ConversationInsightsChart from './ConversationInsightsChart';
import ActionableTakeaways from './ActionableTakeaways';

/**
 * Your Insights Dashboard — premium feature page for mood tracking
 * and conversation analytics.
 *
 * Presentation layer only: data fetching lives in usePremiumInsights.
 * All derived metrics are memoized with useMemo; filter switching
 * uses useCallback.
 */
function YourInsightsDashboard() {
  const { data, loading, error, period, setPeriod, refresh } = usePremiumInsights();

  // Memoized derived metrics -------------------------------------------------
  const kpis = useMemo(() => {
    if (loading) return [];

    const avgDelta = Math.max(0, Math.round((data.averageMood - 3) * 10) / 10);
    return [
      {
        value: data.averageMood.toFixed(1),
        label: 'Average Mood Score',
        subtitle: `Over the last ${period === 'all' ? '90 days' : period}`,
        trend: {
          delta: avgDelta,
          direction: avgDelta >= 0 ? 'up' : 'down',
          label: 'vs. baseline',
        },
      },
      {
        value: data.totalSessions,
        label: 'Chat Sessions',
        subtitle: 'Conversations with your support space',
        trend: {
          delta: 2,
          direction: 'up',
          label: 'this week',
        },
      },
      {
        value: `${data.streakDays} days`,
        label: 'Positive Streak',
        subtitle: 'Consecutive days checked in',
        trend: {
          delta: 1,
          direction: 'up',
          label: 'active streak',
        },
      },
      {
        value: data.checkInsCompleted,
        label: 'Mood Check-ins',
        subtitle: 'Reflections recorded this period',
        trend: {
          delta: 0,
          direction: 'neutral',
          label: 'logged',
        },
      },
    ];
  }, [data, loading, period]);

  // Memoized period label
  const periodLabel = useMemo(() => {
    const labels = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', all: 'All Time' };
    return labels[period] || labels['7d'];
  }, [period]);

  // Memoized filter handler
  const handlePeriodChange = useCallback((value) => {
    setPeriod(value);
  }, [setPeriod]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-12 h-12 rounded-full bg-kindred-error/10 flex items-center justify-center text-kindred-error mb-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-lg font-serif text-kindred-heading mb-2">Unable to load insights</h2>
        <p className="text-sm text-kindred-text mb-4">{error}</p>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-kindred-accent text-white text-sm font-semibold rounded-md hover:bg-kindred-accent-hover transition-colors duration-150"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-kindred-bg text-kindred-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-kindred-line bg-kindred-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-serif text-kindred-heading tracking-tight">Your Insights</h1>
            <p className="text-sm text-kindred-muted">
              A gentle look at your wellbeing over {periodLabel.toLowerCase()}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-kindred-muted uppercase tracking-wider">
              Time period
            </span>
            <div className="inline-flex overflow-hidden border border-kindred-line-strong rounded-md bg-kindred-surface">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePeriodChange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                    period === opt.value
                      ? 'bg-kindred-accent text-white'
                      : 'text-kindred-text hover:bg-kindred-soft'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <KPICard
                key={i}
                value="—"
                label="Loading…"
                loading
              />
            ))
          ) : (
            kpis.map((kpi, i) => (
              <KPICard key={i} {...kpi} />
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <section className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-serif text-kindred-heading">Mood Trajectory</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kindred-soft text-kindred-accent-text text-[10px] font-semibold">
                Your wellbeing over time
              </span>
            </div>
            <MoodTrendChart moodTrend={data.moodTrend} loading={loading} />
          </section>
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-serif text-kindred-heading">Conversation Themes</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kindred-soft text-kindred-accent-text text-[10px] font-semibold">
                Most discussed topics
              </span>
            </div>
            <ConversationInsightsChart themes={data.conversationThemes} loading={loading} />
          </section>
        </div>

        {/* Takeaways */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-serif text-kindred-heading">Actionable Takeaways</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kindred-soft text-kindred-accent-text text-[10px] font-semibold">
              Gentle suggestions
            </span>
          </div>
          <ActionableTakeaways recommendations={data.recommendations} loading={loading} />
        </section>
      </main>
    </div>
  );
}

export default YourInsightsDashboard;
