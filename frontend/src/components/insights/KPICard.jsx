import PropTypes from 'prop-types';
import SkeletonLoader from './SkeletonLoader';

/**
 * A single KPI metric card with a headline value, supporting label,
 * and optional trend indicator.
 *
 * @param {Object} props
 * @param {string|number} props.value - Primary metric value
 * @param {string} props.label - Human-readable label
 * @param {string} props.subtitle - Supporting context line
 * @param {Object} props.trend - Optional trend { delta, direction, label }
 * @param {boolean} props.loading - Render skeleton state
 */
function KPICard({ value, label, subtitle, trend, loading = false }) {
  if (loading) {
    return (
      <div
        className="flex flex-col gap-3 p-6 bg-kindred-surface border border-kindred-line rounded-lg shadow-sm min-w-0"
      >
        <SkeletonLoader width="120" height="32" />
        <SkeletonLoader width="64" height="18" />
        <SkeletonLoader width="48" height="14" />
      </div>
    );
  }

  const isPositive = trend && trend.direction === 'up';
  const trendColor = isPositive
    ? 'text-kindred-accent-text'
    : trend && trend.direction === 'down'
    ? 'text-kindred-error'
    : 'text-kindred-muted';

  return (
    <div
      className="flex flex-col gap-3 p-6 bg-kindred-surface border border-kindred-line rounded-lg shadow-sm min-w-0 hover:border-kindred-line-strong transition-colors duration-150"
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-serif text-kindred-heading tracking-tight"
          aria-label={label}
        >
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-semibold ${trendColor} flex items-center gap-1`}>
            {trend.direction === 'up' ? '▲' : '▼'}
            {Math.abs(trend.delta)} {trend.label}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold text-kindred-muted tracking-wide uppercase">
        {label}
      </span>
      {subtitle && (
        <p className="text-sm text-kindred-text leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

KPICard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.shape({
    delta: PropTypes.number,
    direction: PropTypes.oneOf(['up', 'down', 'neutral']),
    label: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

KPICard.defaultProps = {
  subtitle: undefined,
  trend: undefined,
  loading: false,
};

export default KPICard;
