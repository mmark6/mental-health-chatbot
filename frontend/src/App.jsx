import { useEffect, useRef, useState } from 'react';
import './App.css';

const TODAY_LABEL = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase();
const CURRENT_HOUR = new Date().getHours();
const DAY_GREETING = CURRENT_HOUR < 12 ? 'Good morning' : CURRENT_HOUR < 18 ? 'Good afternoon' : 'Good evening';

const initialMessages = [
  {
    sender: 'bot',
    text: 'Hi Alex, I’m glad you’re here. This is a space to pause, reflect, and talk things through at your own pace. What’s on your mind today?',
    time: 'Just now',
  },
];

const recentChats = [
  { title: 'Finding a little more balance', date: 'Yesterday' },
  { title: 'When everything feels loud', date: 'Mon' },
  { title: 'Getting ready for a big change', date: 'Mon' },
];

function Icon({ name, size = 20, ...props }) {
  const paths = {
    leaf: <><path d="M20.5 3.5C12 3.5 5 5.8 5 12.5a5 5 0 0 0 5 5c6.7 0 9-7 10.5-14Z" /><path d="M3.5 21c3-6 7.2-9.2 12.2-12.2" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-7.5a7.5 7.5 0 1 1 17  -2Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.9Z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    x: <><path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.2l-4.9-6.4L6.5 21H3.4l7.3-8.4L2.8 3h6.4l4.4 5.9L18.9 3Z" /><path d="M17.9 19h1.7L8.3 4.9H6.5L17.9 19Z" fill="currentColor" stroke="none" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name] || paths.spark}
    </svg>
  );
}

function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark"><Icon name="leaf" size={21} /></span>
      <span>kindred<span className="brand-period">.</span></span>
    </div>
  );
}

function ThemeToggle({ theme, onToggle, className = '' }) {
  const isDark = theme === 'dark';
  return (
    <button type="button" className={`theme-toggle ${className}`} onClick={onToggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <Icon name={isDark ? 'sun' : 'moon'} size={17} />
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}

function AuthScreen({ onSignIn, theme, onToggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  function submit(e) {
    e.preventDefault();
    onSignIn(email.trim());
  }

  function showConnectionNotice(provider) {
    setNotice(`${provider} sign-in isn’t connected yet. Use email sign-in or connect your authentication provider.`);
  }

  return (
    <main className="auth-page" data-theme={theme}>
      <section className="auth-story">
        <Brand />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} className="auth-theme-toggle" />
        <div className="story-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> A little space for you</span>
          <h1>Some days, just<br />showing up is <em>enough.</em></h1>
          <p>A gentle place to check in, find perspective, and feel a little less alone. Your wellbeing, at your own pace.</p>
          <div className="story-note">
            <span className="note-icon"><Icon name="heart" size={19} /></span>
            <span>“I didn’t need to have the right words.<br />I just needed somewhere to start.”</span>
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
          <div className="mobile-brand"><Brand /><ThemeToggle theme={theme} onToggle={onToggleTheme} /></div>
          <span className="eyebrow">WELCOME TO KINDRED</span>
          <h2>Let’s make room<br />for how you’re feeling.</h2>
          <p className="auth-subtitle">Sign in to pick up where you left off.</p>
          <form className="sign-in-form" onSubmit={submit}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="password-label">
              <label htmlFor="password">Password</label>
              <button type="button" className="text-button" onClick={() => setNotice('Password reset will be available when your authentication provider is connected.')}>Forgot password?</button>
            </div>
            <input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="primary-button sign-in-button">Sign in <Icon name="arrow" size={17} /></button>
          </form>
          <div className="divider"><span />or continue with<span /></div>
          <div className="social-buttons">
            <button type="button" className="social-button" onClick={() => showConnectionNotice('Google')}><span className="google-mark">G</span>Continue with Google</button>
            <button type="button" className="social-button" onClick={() => showConnectionNotice('Microsoft / Outlook')}><span className="microsoft-mark"><i /><i /><i /><i /></span>Continue with Microsoft / Outlook</button>
            <button type="button" className="social-button" onClick={() => showConnectionNotice('X')}><Icon name="x" size={16} />Continue with X</button>
          </div>
          {notice && <p className="auth-notice" role="status">{notice}</p>}
          <p className="auth-signup">New to Kindred? <button type="button" className="text-button" onClick={() => onSignIn(email.trim())}>Create an account</button></p>
          <p className="privacy-note"><Icon name="shield" size={15} /> Your conversations are private and yours alone.</p>
        </div>
      </section>
    </main>
  );
}

function MoodCheckInPage({ mood, setMood, saved, onSubmit }) {
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

function PremiumCard({ onUpgrade }) {
  return (
    <section className="premium-card">
      <span className="card-kicker">KINDRED PLUS</span>
      <h3>More support<br />for your journey.</h3>
      <p>Get personalized insights, guided exercises, and 1-on-1 support.</p>
      <button type="button" onClick={onUpgrade}>Explore Kindred Plus <Icon name="arrow" size={15} /></button>
      <span className="premium-decoration" aria-hidden="true"><i /><i /><i /></span>
    </section>
  );
}

function AccountCard({ userName, email, onSignOut, onClose }) {
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

function AnalyticsCard({ onUpgrade }) {
  return (
    <button type="button" className="analytics-card" onClick={onUpgrade}>
      <span className="analytics-heading"><Icon name="chart" size={15} /> YOUR WELLBEING</span>
      <div className="chart-placeholder" aria-hidden="true">
        <span className="chart-gridline gridline-one" />
        <span className="chart-gridline gridline-two" />
        <span className="chart-gridline gridline-three" />
        <svg viewBox="0 0 220 58" preserveAspectRatio="none">
          <path d="M2 42 C24 39 28 20 52 27 S83 42 105 27 S136 38 155 17 S187 29 218 7" />
          <circle cx="52" cy="27" r="3" /><circle cx="105" cy="27" r="3" /><circle cx="155" cy="17" r="3" /><circle cx="218" cy="7" r="3" />
        </svg>
      </div>
      <span className="analytics-lock-line"><Icon name="lock" size={13} /> Insights unlock a deeper view of your progress.</span>
      <span className="analytics-foot">Explore your insights <Icon name="arrow" size={14} /></span>
    </button>
  );
}

function UpgradeModal({ onClose, theme }) {
  return (
    <div className="modal-backdrop" data-theme={theme} role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="upgrade-modal" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
        <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}><Icon name="close" size={19} /></button>
        <div className="modal-illustration"><Icon name="leaf" size={30} /></div>
        <span className="eyebrow">MORE SUPPORT, WHEN YOU’RE READY</span>
        <h2 id="upgrade-title">You deserve support<br />that goes a little further.</h2>
        <p className="modal-intro">This is part of Kindred Plus, available through a personal plan or your school or workplace.</p>
        <div className="upgrade-options">
          <div><span className="option-icon"><Icon name="people" size={18} /></span><span><strong>One-on-one counseling</strong><small>Connect with a counselor who gets it.</small></span><Icon name="lock" size={15} className="option-lock" /></div>
          <div><span className="option-icon"><Icon name="chart" size={18} /></span><span><strong>Advanced mood insights</strong><small>Notice patterns and celebrate progress.</small></span><Icon name="lock" size={15} className="option-lock" /></div>
          <div><span className="option-icon"><Icon name="shield" size={18} /></span><span><strong>Priority crisis support</strong><small>Find a faster path to a real person.</small></span><Icon name="lock" size={15} className="option-lock" /></div>
        </div>
        <button type="button" className="primary-button modal-primary" onClick={() => window.alert('Plans can be connected to your billing provider.')}>Explore Kindred Plus <Icon name="arrow" size={17} /></button>
        <button type="button" className="modal-link" onClick={() => window.alert('Ask your school or workplace administrator for your Kindred access link.')}>Have a school or work account? <strong>Link your account</strong></button>
        <p className="modal-footnote">No pressure. Your free support will always be here.</p>
      </section>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top"><Brand compact /><button type="button" className="mobile-menu" aria-label="Open menu"><Icon name="menu" /></button></div>
      <button type="button" className="new-chat-button" onClick={onNewChat}><Icon name="plus" size={17} /> New conversation</button>
      <nav className="side-nav" aria-label="Main navigation">
        <button type="button" className={`nav-item ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setActiveView('chat')}><Icon name="chat" size={18} /> Your conversations</button>
        <button type="button" className={`nav-item ${activeView === 'mood' ? 'active' : ''}`} onClick={() => setActiveView('mood')}><Icon name="heart" size={18} /> Mood check-ins</button>
        <button type="button" className={`nav-item locked-nav ${activeView === 'insights' ? 'active' : ''}`} onClick={() => setActiveView('insights')}><Icon name="chart" size={18} /> Your insights <Icon name="lock" size={13} className="nav-lock" /></button>
        <div className="history-heading"><span className="nav-label">RECENTLY</span><button type="button" aria-label="Add conversation" onClick={onNewChat}><Icon name="plus" size={15} /></button></div>
        <div className="chat-links">{recentChats.map((chat) => <button type="button" key={chat.title} className="history-link" onClick={() => setActiveView('chat')}><Icon name="chat" size={15} /><span><strong>{chat.title}</strong><small>{chat.date}</small></span></button>)}</div>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-note"><span className="help-heart"><Icon name="leaf" size={20} /></span><p>You’re doing<br />a brave thing.<br />That matters.</p></div>
      </div>
    </aside>
  );
}

function App() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [userName, setUserName] = useState('Alex Morgan');
  const [userEmail, setUserEmail] = useState('alex.morgan@example.com');
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('kindred-theme') === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.warn('Could not read the saved theme preference:', error);
      return 'light';
    }
  });
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(initialMessages);
  const [mood, setMood] = useState(4);
  const [moodSaved, setMoodSaved] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [userId] = useState(() => `user_${Math.floor(Math.random() * 1000)}`);
  const accountType = 'freemium';
  const accountMenuRef = useRef(null);
  const firstName = userName.split(' ')[0];

  useEffect(() => {
    function closeAccountMenu(event) {
      if (!accountMenuRef.current?.contains(event.target)) setShowAccount(false);
    }

    document.addEventListener('pointerdown', closeAccountMenu);
    return () => document.removeEventListener('pointerdown', closeAccountMenu);
  }, []);

  function signIn(email) {
    const nameFromEmail = email ? email.split('@')[0].replace(/[._-]/g, ' ') : '';
    setUserName(nameFromEmail ? nameFromEmail.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Alex Morgan');
    if (email) setUserEmail(email);
    setIsSignedIn(true);
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('kindred-theme', nextTheme);
    } catch (error) {
      console.warn('Could not save the theme preference:', error);
    }
  }

  function handleNewChat() {
    setActiveView('chat');
    setChatHistory(initialMessages);
    setChatError('');
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;
    setChatHistory((previous) => [...previous, { sender: 'user', text, time: 'Just now' }]);
    setMessage('');
    setChatError('');
    setIsSending(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: text, account_type: accountType }),
      });
      if (!response.ok) throw new Error(`The chat service returned ${response.status}.`);
      const data = await response.json();
      if (!data.reply) throw new Error('The chat service did not return a reply.');
      setChatHistory((previous) => [...previous, {
        sender: 'bot',
        text: data.reply,
        resources: data.resources,
        time: 'Just now',
      }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatError('We couldn’t reach your support space just now. Your message is still here—please try again.');
    } finally {
      setIsSending(false);
    }
  }

  function handleMoodSubmit() {
    setMoodSaved(true);
  }

  if (!isSignedIn) return <AuthScreen onSignIn={signIn} theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className="dashboard-shell" data-theme={theme}>
      <Sidebar activeView={activeView} setActiveView={(view) => {
        setActiveView(view);
        if (view === 'insights') setShowUpgrade(true);
      }} onNewChat={handleNewChat} />
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
          <div className="topbar-actions"><span className="privacy-pill" title="Private space"><Icon name="shield" size={16} /><span>Private space</span></span><button type="button" className="tier-badge" onClick={() => setShowUpgrade(true)}>Free tier <span>↗</span></button><ThemeToggle theme={theme} onToggle={toggleTheme} /><div className="account-menu" ref={accountMenuRef}><button type="button" className="top-avatar" aria-label="Open account" aria-expanded={showAccount} aria-haspopup="dialog" onClick={() => setShowAccount((open) => !open)}>{firstName.slice(0, 1).toUpperCase()}</button>{showAccount && <AccountCard userName={userName} email={userEmail} onSignOut={() => setIsSignedIn(false)} onClose={() => setShowAccount(false)} />}</div></div>
        </header>

        <div className="dashboard-content">
          {activeView === 'mood' ? (
            <MoodCheckInPage
              mood={mood}
              setMood={(value) => { setMood(value); setMoodSaved(false); }}
              saved={moodSaved}
              onSubmit={handleMoodSubmit}
            />
          ) : (
            <div className="workspace-grid">
              <section className="chat-card">
              <div className="chat-messages" aria-live="polite">
                <div className="day-divider"><span /> TODAY <span /></div>
                {chatHistory.map((msg, index) => (
                  <div className={`message-row ${msg.sender === 'user' ? 'from-user' : 'from-bot'}`} key={`${index}-${msg.sender}`}>
                    {msg.sender === 'bot' && <span className="message-avatar"><Icon name="leaf" size={14} /></span>}
                    <div className="message-content">
                      <div className="message-bubble">{msg.text}</div>
                      {msg.resources?.length > 0 && <div className="resources-box"><strong>Helpful resources</strong><ul>{msg.resources.map((resource, i) => <li key={`${resource}-${i}`}>{resource}</li>)}</ul></div>}
                      <span className="message-time">{msg.time || 'Just now'}</span>
                    </div>
                  </div>
                ))}
                {isSending && <div className="message-row from-bot"><span className="message-avatar"><Icon name="leaf" size={14} /></span><div className="message-bubble typing-indicator">Finding the right words<span>.</span><span>.</span><span>.</span></div></div>}
                {chatError && <p className="chat-error" role="alert">{chatError}</p>}
              </div>
              <div className="quick-prompts" aria-label="Suggested conversation starters">
                <button type="button" onClick={() => setMessage('I feel anxious and would like help understanding it.')}><Icon name="chart" size={15} /> <span>I feel anxious</span></button>
                <button type="button" onClick={() => setMessage('I just need to vent about what is on my mind.')}><Icon name="chat" size={15} /> <span>I just need to vent</span></button>
                <button type="button" onClick={() => setMessage('I am having trouble sleeping and would like some support.')}><Icon name="moon" size={15} /> <span>Help me sleep</span></button>
              </div>
              <form className="chat-composer" onSubmit={handleSendMessage}>
                <input aria-label="Write a message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share whatever’s on your mind..." />
                <button type="submit" aria-label="Send message" disabled={isSending || !message.trim()}><Icon name="send" size={17} /></button>
              </form>
              <div className="chat-footer">
                <span className="composer-hint">This is a supportive space, not a substitute for professional care.</span>
                <div className="emergency-note" aria-label="If you’re in immediate danger, contact your local emergency services." title="If you’re in immediate danger, contact your local emergency services."><Icon name="shield" size={14} /> Need urgent help?</div>
              </div>
            </section>

            <aside className="right-rail">
              <AnalyticsCard onUpgrade={() => setShowUpgrade(true)} />
              <PremiumCard onUpgrade={() => setShowUpgrade(true)} />
              <blockquote className="daily-quote">
                <span className="quote-flourish"><Icon name="leaf" size={11} /></span>
                “A calmer mind<br />is a kinder tomorrow.”
              </blockquote>
            </aside>
          </div>
          )}
        </div>
      </main>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} theme={theme} />}
    </div>
  );
}

export default App;
