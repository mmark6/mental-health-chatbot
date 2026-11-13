import { useEffect, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';

import { auth } from './firebase.js';
import Chatbot from './Chatbot.jsx';
import Icon from './Icon.jsx';
import ThemeToggle from './Themetoggle.jsx';
import {
  MoodCheckInPage,
  PremiumCard,
  AccountCard,
  AnalyticsCard,
  UpgradeModal,
  Sidebar,
} from './dashboardparts.jsx';

const CURRENT_HOUR = new Date().getHours();
const DAY_GREETING =
  CURRENT_HOUR < 12 ? 'Good morning' : CURRENT_HOUR < 18 ? 'Good afternoon' : 'Good evening';

export default function Dashboard({ firebaseUser, theme, onToggleTheme }) {
  const userEmail = firebaseUser.email || '';

  const userName =
    firebaseUser.displayName ||
    (userEmail
      ? userEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Friend');

  const firstName = userName.split(' ')[0];

  const [mood, setMood] = useState(4);
  const [moodSaved, setMoodSaved] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const accountMenuRef = useRef(null);

  useEffect(() => {
    function closeAccountMenu(event) {
      if (!accountMenuRef.current?.contains(event.target)) setShowAccount(false);
    }

    document.addEventListener('pointerdown', closeAccountMenu);
    return () => document.removeEventListener('pointerdown', closeAccountMenu);
  }, []);

  async function handleSignOut() {
    // App.jsx notices the signed-out state and redirects to /login
    await signOut(auth);
  }

  function handleNewChat() {
    setActiveView('chat');
    setSessionId(crypto.randomUUID());
  }

  function handleMoodSubmit() {
    setMoodSaved(true);
  }

  return (
    <div className="dashboard-shell" data-theme={theme}>
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'insights') setShowUpgrade(true);
        }}
        onNewChat={handleNewChat}
      />

      <main className="main-panel">
        <header className={`topbar ${activeView === 'mood' ? 'mood-topbar' : ''}`}>
          <div className="dashboard-greeting">
            {activeView === 'mood' ? (
              <>
                <h1>A moment to check in.</h1>
                <p>Take a moment for yourself. Every feeling deserves space.</p>
              </>
            ) : (
              <>
                <h1>{DAY_GREETING}, {firstName}.</h1>
                <p>Take a moment for yourself. You’re in a safe, supportive space.</p>
              </>
            )}
          </div>

          {activeView !== 'mood' && (
            <div className="breath-prompt">
              <span className="breath-icon"><Icon name="leaf" size={20} /></span>
              <span><strong>Take a breath</strong><small>1 min</small></span>
            </div>
          )}

          <div className="topbar-actions">
            <span className="privacy-pill" title="Private space">
              <Icon name="shield" size={16} />
              <span>Private space</span>
            </span>

            <button type="button" className="tier-badge" onClick={() => setShowUpgrade(true)}>
              Free tier <span>↗</span>
            </button>

            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <div className="account-menu" ref={accountMenuRef}>
              <button
                type="button"
                className="top-avatar"
                aria-label="Open account"
                aria-expanded={showAccount}
                aria-haspopup="dialog"
                onClick={() => setShowAccount((open) => !open)}
              >
                {firstName.slice(0, 1).toUpperCase()}
              </button>

              {showAccount && (
                <AccountCard
                  userName={userName}
                  email={userEmail}
                  onSignOut={handleSignOut}
                  onClose={() => setShowAccount(false)}
                />
              )}
            </div>
          </div>
        </header>

        {!firebaseUser.emailVerified && (
          <p className="auth-notice" role="status">
            Please verify your email. We sent a link to {userEmail}.
          </p>
        )}

        <div className="dashboard-content">
          {activeView === 'mood' && (
            <MoodCheckInPage
              mood={mood}
              setMood={(value) => { setMood(value); setMoodSaved(false); }}
              saved={moodSaved}
              onSubmit={handleMoodSubmit}
            />
          )}

          <div className="workspace-grid" hidden={activeView === 'mood'}>
            <Chatbot key={sessionId} sessionId={sessionId} />

            <aside className="right-rail">
              <AnalyticsCard onUpgrade={() => setShowUpgrade(true)} />
              <PremiumCard onUpgrade={() => setShowUpgrade(true)} />
              <blockquote className="daily-quote">
                <span className="quote-flourish"><Icon name="leaf" size={11} /></span>
                “A calmer mind<br />is a kinder tomorrow.”
              </blockquote>
            </aside>
          </div>
        </div>
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} theme={theme} />}
    </div>
  );
}
