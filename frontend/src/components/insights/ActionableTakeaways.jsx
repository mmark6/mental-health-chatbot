import PropTypes from 'prop-types';
import SkeletonLoader from './SkeletonLoader';

/**
 * Actionable Takeaways — cleanly styled list of AI-generated
 * personalized recommendations based on the user's data.
 *
 * @param {Object} props
 * @param {string[]} props.recommendations - List of recommendations
 * @param {boolean} props.loading
 */
function ActionableTakeaways({ recommendations = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px]">
        <SkeletonLoader width="100%" height="20" />
        <SkeletonLoader width="80%" height="18" className="mt-3" />
        <SkeletonLoader width="60%" height="18" className="mt-2" />
        <SkeletonLoader width="70%" height="18" className="mt-2" />
        <SkeletonLoader width="50%" height="18" className="mt-2" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px] flex flex-col items-center justify-center text-center">
        <p className="text-kindred-muted text-sm">No recommendations yet.</p>
        <p className="text-kindred-text text-xs mt-1">
          Complete a few mood check-ins to receive personalized takeaways.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-kindred-surface border border-kindred-line rounded-lg shadow-sm p-5 min-h-[260px]">
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex gap-3 items-start">
            <div
              className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-kindred-soft text-kindred-accent-text text-[10px] font-bold"
              aria-hidden="true"
            >
              {index + 1}
            </div>
            <p className="text-sm text-kindred-text leading-relaxed">{rec}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

ActionableTakeaways.propTypes = {
  recommendations: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

ActionableTakeaways.defaultProps = {
  recommendations: [],
  loading: false,
};

export default ActionableTakeaways;
