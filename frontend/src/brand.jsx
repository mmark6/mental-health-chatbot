import Icon from './Icon.jsx';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><Icon name="leaf" size={21} /></span>
      <span>kindred<span className="brand-period">.</span></span>
    </div>
  );
}
