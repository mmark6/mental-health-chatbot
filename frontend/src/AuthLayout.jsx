import Brand from './brand.jsx';
import ThemeToggle from './Themetoggle.jsx';
import Icon from './Icon.jsx';

export function GoogleButton({ onClick, disabled }) {
  return (
    <div className="social-buttons">
      <button
        type="button"
        className="social-button"
        onClick={onClick}
        disabled={disabled}
      >
        <span className="google-mark">G</span>
        Continue with Google
      </button>
    </div>
  );
}

/**
 * Shared two-column layout used by the Login and Signup pages.
 * `children` is rendered in the right-hand form column.
 */
export default function AuthLayout({ theme, onToggleTheme, heading, subtitle, children }) {
  return (
    <main className="auth-page" data-theme={theme}>
      <section className="auth-story">
        <Brand />
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
          className="auth-theme-toggle"
        />

        <div className="story-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> A little space for you
          </span>

          <h1>Some days, just<br />showing up is <em>enough.</em></h1>

          <p>
            A gentle place to check in, find perspective, and feel a little
            less alone. Your wellbeing, at your own pace.
          </p>

          <div className="story-note">
            <span className="note-icon"><Icon name="heart" size={19} /></span>
            <span>
              “I didn’t need to have the right words.<br />
              I just needed somewhere to start.”
            </span>
            <span className="note-author">— A Kindred member</span>
          </div>
        </div>

        <div className="auth-landscape" aria-hidden="true">
          <span className="landscape-sun" />
          <span className="landscape-hill hill-back" />
          <span className="landscape-hill hill-front" />
          <span className="landscape-leaf leaf-one">✳</span>
          <span className="landscape-leaf leaf-two">✳</span>
        </div>

        <span className="auth-footnote">A softer place to land.</span>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <Brand />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          <span className="eyebrow">WELCOME TO KINDRED</span>

          <h2>{heading}</h2>

          <p className="auth-subtitle">{subtitle}</p>

          {children}

          <p className="privacy-note">
            <Icon name="shield" size={15} />
            Your conversations are private and yours alone.
          </p>
        </div>
      </section>
    </main>
  );
}
