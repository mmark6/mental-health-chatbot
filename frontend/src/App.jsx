import { useEffect, useRef, useState } from 'react';
import './App.css';

const TODAY_LABEL = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase();

const initialMessages = [
  {
    sender: 'bot',
    text: 'Hi Alex, I’m glad you’re here. This is a space to pause, reflect, and talk things through at your own pace. What’s on your mind today?',
    time: 'Just now',
  },
];

const recentChats = [
  'Finding a little more balance',
  'When everything feels loud',
  'Getting ready for a big change',
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

function MoodCard({ mood, setMood, onSubmit, saved, error, detectedTopic }) {
  const moods = [
    { score: 1, face: '◡̈', label: 'Low' },
    { score: 2, face: '⌣', label: 'A little low' },
    { score: 3, face: '○', label: 'Okay' },
    { score: 4, face: '⌣', label: 'Pretty good' },
    { score: 5, face: '☺', label: 'Good' },
  ];
  const topicLabels = {
    anxiety: 'Your message may relate to anxious feelings.',
    depression: 'Your message may relate to feeling low or weighed down.',
    stress: 'Your message may relate to stress or pressure.',
    suicidal: 'Your message may include urgent safety concerns.',
  };
  const selectedMood = moods.find((item) => item.score === mood)?.label;
  const reflectionText = detectedTopic
    ? topicLabels[detectedTopic] || 'The system could not identify a clear conversation topic. Your own check-in is the best guide.'
    : 'Share a message in your conversation to get a gentle reflection here.';
  return (
    <section className="side-card mood-card">
      <div className="card-heading">
        <div><span className="card-kicker">A MOMENT FOR YOU</span><h3>Daily check-in</h3></div>
        <span className="mood-sun"><Icon name="sun" size={19} /></span>
      </div>
      <p className="muted-copy">How are you feeling today?</p>
      <span className="free-feature-label">FREE · INCLUDED WITH EVERY ACCOUNT</span>
      <div className="mood-options" role="group" aria-label="Choose your mood">
        {moods.map((item) => (
          <button key={item.score} type="button" className={`mood-option ${mood === item.score ? 'selected' : ''}`} aria-label={item.label} aria-pressed={mood === item.score} onClick={() => setMood(item.score)}>
            <span>{item.face}</span>
          </button>
        ))}
      </div>
      <div className="mood-labels"><span>Not great</span><span>Really good</span></div>
      <p className="selected-mood-label">Your check-in: <strong>{selectedMood}</strong></p>
      <button type="button" className="secondary-button mood-submit" onClick={onSubmit}>{saved ? 'Today’s check-in saved' : 'Save check-in'} <Icon name={saved ? 'heart' : 'arrow'} size={15} /></button>
      {error && <p className="inline-error" role="status">{error}</p>}
      {saved && <p className="saved-note" role="status">Thanks for checking in with yourself.</p>}
      <div className="system-reflection" aria-live="polite">
        <strong>Conversation reflection <span>NOT A DIAGNOSIS</span></strong>
        <p>{reflectionText}</p>
      </div>
    </section>
  );
}

function PremiumCard({ onUpgrade }) {
  return (
    <section className="premium-card">
      <div className="premium-spark"><Icon name="spark" size={19} /></div>
      <span className="card-kicker">A LITTLE MORE SUPPORT</span>
      <h3>Care that meets<br />you where you are.</h3>
      <p>Explore one-on-one counseling and deeper tools for your wellbeing.</p>
      <button type="button" onClick={onUpgrade}>Explore Kindred Plus <Icon name="arrow" size={15} /></button>
      <div className="premium-shortcut-row">
        <button type="button" onClick={onUpgrade}><Icon name="people" size={14} /> 1-on-1 counselor</button>
        <button type="button" onClick={onUpgrade}><Icon name="shield" size={14} /> Priority support</button>
      </div>
      <span className="premium-decoration" aria-hidden="true" />
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
      <div className="analytics-heading">
        <span><span className="card-kicker">YOUR WELLBEING</span><strong>Advanced mood insights</strong></span>
        <span className="locked-label"><Icon name="lock" size={12} /> PLUS</span>
      </div>
      <div className="chart-placeholder" aria-hidden="true">
        <span className="chart-y-label">GOOD</span>
        <span className="chart-gridline gridline-one" />
        <span className="chart-gridline gridline-two" />
        <span className="chart-gridline gridline-three" />
        <svg viewBox="0 0 220 58" preserveAspectRatio="none">
          <path d="M2 42 C24 39 28 20 52 27 S83 42 105 27 S136 38 155 17 S187 29 218 7" />
          <circle cx="52" cy="27" r="3" /><circle cx="105" cy="27" r="3" /><circle cx="155" cy="17" r="3" /><circle cx="218" cy="7" r="3" />
        </svg>
        <span className="chart-x-labels"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></span>
        <span className="chart-lock"><Icon name="lock" size={15} /></span>
      </div>
      <span className="analytics-foot">Unlock patterns and celebrate your progress <Icon name="arrow" size={13} /></span>
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
        <span className="nav-label">YOUR SPACE</span>
        <button type="button" className={`nav-item ${activeView === 'chat' ? 'active' : ''}`} onClick={() => setActiveView('chat')}><Icon name="chat" size={18} /> Your conversations</button>
        <button type="button" className={`nav-item ${activeView === 'mood' ? 'active' : ''}`} onClick={() => setActiveView('mood')}><Icon name="heart" size={18} /> Mood check-ins</button>
        <button type="button" className={`nav-item locked-nav ${activeView === 'insights' ? 'active' : ''}`} onClick={() => setActiveView('insights')}><Icon name="chart" size={18} /> Your insights <Icon name="lock" size={13} className="nav-lock" /></button>
        <div className="history-heading"><span className="nav-label">RECENTLY</span><button type="button" aria-label="Add conversation" onClick={onNewChat}><Icon name="plus" size={15} /></button></div>
        <div className="chat-links">{recentChats.map((chat, i) => <button type="button" key={chat} className="history-link" onClick={() => setActiveView('chat')}><span className={`history-dot dot-${i}`} />{chat}</button>)}</div>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-note"><span className="help-heart"><Icon name="heart" size={17} /></span><p>You don’t have to figure<br />everything out today.</p></div>
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
  const [moodError, setMoodError] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [detectedTopic, setDetectedTopic] = useState(null);
  const [userId] = useState(() => `user_${Math.floor(Math.random() * 1000)}`);
  const accountType = 'freemium';
  const accountMenuRef = useRef(null);

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
    setDetectedTopic(null);
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;
    setChatHistory((previous) => [...previous, { sender: 'user', text, time: 'Just now' }]);
    setMessage('');
    setChatError('');
    setDetectedTopic(null);
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
      setDetectedTopic(data.detected_topic || null);
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatError('We couldn’t reach your support space just now. Your message is still here—please try again.');
    } finally {
      setIsSending(false);
    }
  }

  async function handleMoodSubmit() {
    setMoodError('');
    setMoodSaved(false);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mood_score: mood, account_type: accountType }),
      });
      if (!response.ok) throw new Error(`The mood service returned ${response.status}.`);
      setMoodSaved(true);
    } catch (error) {
      console.error('Mood API Error:', error);
      setMoodError('We couldn’t save that just now. Please try again.');
    }
  }

  if (!isSignedIn) return <AuthScreen onSignIn={signIn} theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className="dashboard-shell" data-theme={theme}>
      <Sidebar activeView={activeView} setActiveView={(view) => {
        setActiveView(view);
        if (view === 'insights') setShowUpgrade(true);
      }} onNewChat={handleNewChat} />
      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Your space</span><span className="crumb-slash">/</span><strong>{activeView === 'mood' ? 'Mood check-ins' : 'A listening space'}</strong></div>
          <div className="topbar-actions"><span className="privacy-pill"><Icon name="shield" size={14} /> Private space</span><button type="button" className="tier-badge" onClick={() => setShowUpgrade(true)}>Free tier <span>↗</span></button><ThemeToggle theme={theme} onToggle={toggleTheme} /><div className="account-menu" ref={accountMenuRef}><button type="button" className="top-avatar" aria-label="Open account" aria-expanded={showAccount} aria-haspopup="dialog" onClick={() => setShowAccount((open) => !open)}>{userName.slice(0, 1).toUpperCase()}</button>{showAccount && <AccountCard userName={userName} email={userEmail} onSignOut={() => setIsSignedIn(false)} onClose={() => setShowAccount(false)} />}</div></div>
        </header>

        <div className="dashboard-content">
          <div className="content-heading">
            <div><span className="eyebrow">{TODAY_LABEL}</span><h1>{activeView === 'mood' ? 'A moment to check in.' : 'It’s okay to take a breath.'}</h1><p>You can start wherever you are. There’s no right way to feel.</p></div>
            <div className="heading-flower" aria-hidden="true"><span>✳</span></div>
          </div>

          <div className="workspace-grid">
            <section className="chat-card">
              <div className="chat-card-header">
                <div className="companion-avatar"><Icon name="leaf" size={21} /></div>
                <div className="companion-copy"><strong>Your listening space</strong><span><i /> Here with you</span></div>
                <span className="conversation-label">A GENTLE CHECK-IN</span>
              </div>
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
              <form className="chat-composer" onSubmit={handleSendMessage}>
                <input aria-label="Write a message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share whatever’s on your mind..." />
                <span className="composer-hint">This is a supportive space, not a substitute for professional care.</span>
                <button type="submit" aria-label="Send message" disabled={isSending || !message.trim()}><Icon name="send" size={17} /></button>
              </form>
              <div className="emergency-note"><Icon name="heart" size={14} /> If you’re in immediate danger, call your local emergency services.</div>
            </section>

            <aside className="right-rail">
              <MoodCard mood={mood} setMood={(value) => { setMood(value); setMoodSaved(false); }} onSubmit={handleMoodSubmit} saved={moodSaved} error={moodError} detectedTopic={detectedTopic} />
              <AnalyticsCard onUpgrade={() => setShowUpgrade(true)} />
              <PremiumCard onUpgrade={() => setShowUpgrade(true)} />
            </aside>
          </div>
        </div>
      </main>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} theme={theme} />}
    </div>
  );
}

export default App;
