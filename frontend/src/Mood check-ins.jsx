
import React from 'react';

function MoodCheckIn({ mood, setMood, saved, onSubmit }) {
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
          <span className="mood-page-icon">♡</span>
        </div>

        <div className="mood-date-label">
          {new Date().toLocaleDateString('en', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }).toUpperCase()}
        </div>

        <h3 className="mood-question">
          Choose the mood that feels closest to you.
        </h3>

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
            <span>
              <strong>{selected.label}</strong> — {selected.description}
            </span>
          </div>
        )}

        <div className="mood-save-area">
          <button
            type="button"
            className="primary-button mood-page-save"
            onClick={onSubmit}
          >
            {saved ? 'Check-in saved ✓' : 'Save today’s check-in'}
          </button>

          {saved && (
            <p className="mood-page-success" role="status">
              Thank you for taking a moment to check in with yourself.
            </p>
          )}
        </div>
      </div>

      <aside className="mood-gentle-panel">
        <span className="gentle-icon">✿</span>
        <span className="card-kicker">A GENTLE REMINDER</span>
        <h3>There is no wrong way to feel.</h3>
        <p>
          Your feelings are part of your story. You do not have to change
          them, explain them or judge yourself for having them.
        </p>

        <div className="gentle-divider" />

        <strong>Something to remember</strong>
        <p>
          Small moments of self-awareness can make a meaningful difference.
        </p>

        <span className="gentle-decoration">✳</span>
      </aside>
    </section>
  );
}

export default MoodCheckIn;
