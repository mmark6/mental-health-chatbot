import PropTypes from 'prop-types';
import SkeletonLoader from './SkeletonLoader';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';

/**
 * Mood Trajectory Chart — smooth line + area chart showing mood
 * trends over time. Data is memoized via useMemo in the parent.
 *
 * @param {Object} props
 * @param {Array} props.moodTrend - Array of { date, score, label }
 * @param {boolean} props.loading
 */
function MoodTrendChart({ moodTrend = [], loading = false }) {
  if (loading || moodTrend.length === 0) {
    return (
      <div className="aspect-video w-full bg-kindred-surface border border-kindred-line rounded-lg flex items-center justify-center min-h-[260px]">
        <SkeletonLoader width="100%" height="260" />
      </div>
    );
  }

  const avgScore =
    moodTrend.reduce((sum, p) => sum + p.score, 0) / moodTrend.length;

  return (
    <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px]">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={moodTrend}
          margin={{ top: 10, right: 20, bottom: 8, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--kindred-line)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--kindred-text)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            tick={{ fontSize: 10, fill: 'var(--kindred-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v.toFixed(0)}`}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: 'var(--kindred-accent)', strokeWidth: 1, fillOpacity: 0.05 }}
            contentStyle={{
              backgroundColor: 'var(--kindred-surface)',
              border: '1px solid var(--kindred-line)',
              borderRadius: '8px',
              color: 'var(--kindred-heading)',
              fontSize: '12px',
            }}
            itemStyle={{ color: 'var(--kindred-text)', marginBottom: 4 }}
            labelStyle={{ color: 'var(--kindred-muted)', fontSize: '10px', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--kindred-accent)"
            strokeWidth={2}
            fillOpacity={0.12}
            fill="var(--kindred-accent)"
            dot={false}
            activeDot={{ r: 0 }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--kindred-accent)"
            strokeWidth={2.5}
            dot={false}
          />
          <ReferenceLine
            y={avgScore}
            stroke="var(--kindred-leaf-soft)"
            strokeDasharray="4 4"
            label={{
              value: `Average: ${avgScore.toFixed(1)}`,
              position: 'insideLeft',
              fill: 'var(--kindred-leaf)',
              fontSize: 10,
              fontWeight: 600,
            }}
          />
          {moodTrend.length > 0 && (
            <ReferenceDot
              x={moodTrend[moodTrend.length - 1].label}
              y={moodTrend[moodTrend.length - 1].score}
              fill="var(--kindred-accent)"
              r={4}
              stroke="#fff"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

MoodTrendChart.propTypes = {
  moodTrend: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      score: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

MoodTrendChart.defaultProps = {
  moodTrend: [],
  loading: false,
};

export default MoodTrendChart;
