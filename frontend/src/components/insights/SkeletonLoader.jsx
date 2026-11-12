import PropTypes from 'prop-types';

/**
 * Visually pleasing skeleton loader that matches the dimensions
 * of the content it replaces while data is fetching.
 *
 * @param {Object} props
 * @param {string} props.className - Additional Tailwind classes
 * @param {number} props.width - Width in px or CSS value
 * @param {number} props.height - Height in px or CSS value
 * @param {boolean} props.circle - Render as a circular avatar skeleton
 */
function SkeletonLoader({ className = '', width, height, circle = false }) {
  const size = circle
    ? `w-${Math.round(width / 8)} h-${Math.round(height / 8)} rounded-full`
    : `w-full h-full`;

  return (
    <div
      className={`animate-pulse-soft bg-kindred-soft rounded-md ${size} ${className}`}
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : '8px',
      }}
      aria-hidden="true"
    />
  );
}

SkeletonLoader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  circle: PropTypes.bool,
};

SkeletonLoader.defaultProps = {
  className: '',
  width: '100%',
  height: '100%',
  circle: false,
};

export default SkeletonLoader;
