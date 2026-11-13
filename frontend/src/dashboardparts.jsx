import Icon from './Icon.jsx';
import Brand from './brand.jsx';

const TODAY_LABEL = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date()).toUpperCase();

const recentChats = [
  { title: 'Finding a little more balance', date: 'Yesterday' },
  { title: 'When everything feels loud', date: 'Mon' },
  { title: 'Getting ready for a big change', date: 'Mon' },
];

export function MoodCheckInPage({ mood, setMood, saved, onSubmit }) {
  const moods = [
    { score: 1, face: '😔', label: 'Very low', description: 'I am having a difficult day.' },
    { score: 2, face: '😕', label: 'A little low', description: 'Things feel a little difficult.' },
    { score: 3, face: '😐', label: 'Okay', description: 'I am somewhere in the middle.' },
    { score: 4, face: '🙂', label: 'Pretty good', description: 'I am feeling quite positive.' },
    { score: 5, face: '😊', label: 'Good', description: 'I am feeling happy and well.' },
  ];

  const selected = moods.find((item) => item.score === mood);

  return (
    <section className="mood-page-layout">
      <div className="mood-main-panel">
        <div className="mood-page-heading">
          <div>
            <span className="card-kicker">YOUR DAILY WELLBEING</span>
            <h2>How are you feeling?</h2>
            <p>Take a moment for yourself. Every feeling deserves space.</p>
          </div>
          <span className="mood-page-icon">
            <Icon name="heart" size={25} />
          </span>
        </div>

        <div className="mood-date-label">
          <Icon name="sun" size={16} />
          {TODAY_LABEL}
        </div>

        <h3 className="mood-question">Choose the mood that feels closest to you.</h3>

        <div className="mood-page-options">
          {moods.map((item) => (
            <button
              key={item.score}
              type="button"
              className={`mood-page-option ${mood === item.score ? 'selected' : ''}`}
              onClick={() => setMood(item.score)}
              aria-pressed={mood === item.score}
            >
              <span className="mood-page-face">{item.face}</span>
              <strong>{item.label}</strong>
              <span className="mood-page-check">
                {mood === item.score ? 'Selected' : 'Choose'}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mood-selection-note">
            <span className="selection-dot" />
            <span><strong>{selected.label}</strong> — {selected.description}</span>
          </div>
        )}

        <div className="mood-save-area">
          <button type="button" className="primary-button mood-page-save" onClick={onSubmit}>
            {saved ? 'Check-in saved ✓' : 'Save today’s check-in'}
            <Icon name="arrow" size={17} />
          </button>
          {saved && (
            <p className="mood-page-success" role="status">
              Thank you for taking a moment to check in with yourself.
            </p>
          )}
        </div>
      </div>

      <aside className="mood-gentle-panel">
        <span className="gentle-icon"><Icon name="leaf" size={23} /></span>
        <span className="card-kicker">A GENTLE REMINDER</span>
        <h3>There is no wrong way to feel.</h3>
        <p>
          Your feelings are part of your story. You do not have to change
          them, explain them or judge yourself for having them.
        </p>
        <div className="gentle-divider" />
        <strong>Something to remember</strong>
        <p>Small moments of self-awareness can make a meaningful difference.</p>
        <span className="gentle-decoration">✳</span>
      </aside>
    </section>
  );
}

export function PremiumCard({ onUpgrade }) {
  return (
    <section className="premium-card">
      <span className="card-kicker">KINDRED PLUS</span>
      <h3>More support<br />for your journey.</h3>
      <p>Get personalized insights, guided exercises, and 1-on-1 support.</p>
      <button type="button" onClick={onUpgrade}>
        Explore Kindred Plus <Icon name="arrow" size={15} />
      </button>
      <span className="premium-decoration" aria-hidden="true"><i /><i /><i /></span>
    </section>
  );
}

export function AccountCard({ userName, email, onSignOut, onClose }) {
  return (
    <section className="account-card" role="dialog" aria-label="Account information" aria-live="polite">
      <div className="account-card-heading">
        <span className="card-kicker">YOUR ACCOUNT</span>
        <span className="account-plan">FREE PLAN</span>
      </div>
      <button type="button" className="account-close" onClick={onClose}>Close</button>
      <div className="account-person">
        <span className="account-avatar">{userName.slice(0, 1).toUpperCase()}</span>
        <span className="account-details">
          <strong>{userName}</strong>
          <span>{email}</span>
        </span>
      </div>
      <div className="account-includes"><Icon name="heart" size={15} /> Mood check-ins are free</div>
      <button type="button" className="account-signout" onClick={onSignOut}>Sign out</button>
    </section>
  );
}

export function AnalyticsCard({ onUpgrade }) {
  return (
    <button type="button" className="analytics-card" onClick={onUpgrade}>
      <span className="analytics-heading"><Icon name="chart" size={15} /> YOUR WELLBEING</span>
      <div className="chart-placeholder" aria-hidden="true">
        <span className="chart-gridline gridline-one" />
        <span className="chart-gridline gridline-two" />
        <span className="chart-gridline gridline-three" />
        <svg viewBox="0 0 220 58" preserveAspectRatio="none">
          <path d="M2 42 C24 39 28 20 52 27 S83 42 105 27 S136 38 155 17 S187 29 218 7" />
          <circle cx="52" cy="27" r="3" />
          <circle cx="105" cy="27" r="3" />
          <circle cx="155" cy="17" r="3" />
          <circle cx="218" cy="7" r="3" />
        </svg>
      </div>
      <span className="analytics-lock-line"><Icon name="lock" size={13} /> Insights unlock a deeper view of your progress.</span>
      <span className="analytics-foot">Explore your insights <Icon name="arrow" size={14} /></span>
    </button>
  );
}

export function UpgradeModal({ onClose, theme }) {
  return (
    <div
      className="modal-backdrop"
      data-theme={theme}
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <section className="upgrade-modal" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
        <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>
          <Icon name="close" size={19} />
        </button>
        <div className="modal-illustration"><Icon name="leaf" size={30} /></div>
        <span className="eyebrow">MORE SUPPORT, WHEN YOU’RE READY</span>
        <h2 id="upgrade-title">You deserve support<br />that goes a little further.</h2>
        <p className="modal-intro">This is part of Kindred Plus, available through a personal plan or your school or workplace.</p>
        <div className="upgrade-options">
          <div>
            <span className="option-icon"><Icon name="people" size={18} /></span>
            <span><strong>One-on-one counseling</strong><small>Connect with a counselor who gets it.</small></span>
            <Icon name="lock" size={15} className="option-lock" />
          </div>
          <div>
            <span className="option-icon"><Icon name="chart" size={18} /></span>
            <span><strong>Advanced mood insights</strong><small>Notice patterns and celebrate progress.</small></span>
            <Icon name="lock" size={15} className="option-lock" />
          </div>
          <div>
            <span className="option-icon"><Icon name="shield" size={18} /></span>
            <span><strong>Priority crisis support</strong><small>Find a faster path to a real person.</small></span>
            <Icon name="lock" size={15} className="option-lock" />
          </div>
        </div>
        <button
          type="button"
          className="primary-button modal-primary"
          onClick={() => window.alert('Plans can be connected to your billing provider.')}
        >
          Explore Kindred Plus <Icon name="arrow" size={17} />
        </button>
        <button
          type="button"
          className="modal-link"
          onClick={() => window.alert('Ask your school or workplace administrator for your Kindred access link.')}
        >
          Have a school or work account? <strong>Link your account</strong>
        </button>
        <p className="modal-footnote">No pressure. Your free support will always be here.</p>
      </section>
    </div>
  );
}

export function Sidebar({ activeView, setActiveView, onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Brand compact />
        <button type="button" className="mobile-menu" aria-label="Open menu"><Icon name="menu" /></button>
      </div>

      <button type="button" className="new-chat-button" onClick={onNewChat}>
        <Icon name="plus" size={17} /> New conversation
      </button>

      <nav className="side-nav" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-item ${activeView === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveView('chat')}
        >
          <Icon name="chat" size={18} /> Your conversations
        </button>
        <button
          type="button"
          className={`nav-item ${activeView === 'mood' ? 'active' : ''}`}
          onClick={() => setActiveView('mood')}
        >
          <Icon name="heart" size={18} /> Mood check-ins
        </button>
        <button
          type="button"
          className={`nav-item locked-nav ${activeView === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveView('insights')}
        >
          <Icon name="chart" size={18} /> Your insights <Icon name="lock" size={13} className="nav-lock" />
        </button>

        <div className="history-heading">
          <span className="nav-label">RECENTLY</span>
          <button type="button" aria-label="Add conversation" onClick={onNewChat}>
            <Icon name="plus" size={15} />
          </button>
        </div>

        <div className="chat-links">
          {recentChats.map((chat) => (
            <button
              type="button"
              key={chat.title}
              className="history-link"
              onClick={() => setActiveView('chat')}
            >
              <Icon name="chat" size={15} />
              <span><strong>{chat.title}</strong><small>{chat.date}</small></span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="help-note">
          <span className="help-heart"><Icon name="leaf" size={20} /></span>
          <p>You’re doing<br />a brave thing.<br />That matters.</p>
        </div>
      </div>
    </aside>
  );
}
