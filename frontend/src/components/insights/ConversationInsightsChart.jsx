import PropTypes from 'prop-types';
import SkeletonLoader from './SkeletonLoader';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

/**
 * Conversation Insights Chart — horizontal bar chart showing
 * the most discussed themes derived from chatbot interactions.
 *
 * @param {Object} props
 * @param {Array} props.themes - Array of { theme, count, percentage }
 * @param {boolean} props.loading
 */
function ConversationInsightsChart({ themes = [], loading = false }) {
  if (loading || themes.length === 0) {
    return (
      <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px] flex flex-col items-center justify-center">
        <SkeletonLoader width="120" height="24" />
        <SkeletonLoader width="100%" height="20" className="mt-3" />
        <SkeletonLoader width="80%" height="20" className="mt-2" />
        <SkeletonLoader width="60%" height="20" className="mt-2" />
      </div>
    );
  }

  const maxCount = Math.max(...themes.map((t) => t.count));

  const themeColors = [
    'var(--kindred-accent)',
    'var(--kindred-leaf)',
    'var(--kindred-leaf-soft)',
    '#bfe6c3',
    '#cdeccb',
    '#a9dcb0',
  ];

  return (
    <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px]">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={themes}
          margin={{ top: 10, right: 20, bottom: 10, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--kindred-line)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, maxCount * 1.15]}
            tick={{ fontSize: 10, fill: 'var(--kindred-muted)' }}
            axisLine={false}
            tickLine={false}
            hide
          />
          <YAxis
            dataKey="theme"
            type="category"
            tick={{ fontSize: 11, fill: 'var(--kindred-heading)', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--kindred-surface)',
              border: '1px solid var(--kindred-line)',
              borderRadius: '8px',
              color: 'var(--kindred-heading)',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'var(--kindred-muted)', fontSize: '10px', fontWeight: 600 }}
            itemStyle={{ color: 'var(--kindred-text)', marginBottom: 4 }}
          />
          <Bar
            dataKey="count"
            radius={[0, 6, 6, 0]}
            background={{ radius: [0, 6, 6, 0], fill: 'var(--kindred-line)' }}
          >
            {themes.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ConversationInsightsChart.propTypes = {
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      theme: PropTypes.string,
      count: PropTypes.number,
      percentage: PropTypes.number,
    })
  ),
  loading: PropTypes.bool,
};

ConversationInsightsChart.defaultProps = {
  themes: [],
  loading: false,
};

export default ConversationInsightsChart;
