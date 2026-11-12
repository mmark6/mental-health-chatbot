import { useState } from 'react';
import './App.css';

const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8000/api/chat';

const initialMessages = [
  {
    sender: 'bot',
    text: 'Hi Alex, I’m glad you’re here. This is a space to pause, reflect, and talk things through at your own pace. What’s on your mind today?',
    time: 'Just now',
  },
];

function ChatIcon({ name, size = 16 }) {
  const paths = {
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-7.5a7.5 7.5 0 1 1 17-2Z" /><path d="M8 11h.01M12 11h.01M16 11h.01" /></>,
    leaf: <><path d="M20.5 3.5C12 3.5 5 5.8 5 12.5a5 5 0 0 0 5 5c6.7 0 9-7 10.5-14Z" /><path d="M3.5 21c3-6 7.2-9.2 12.2-12.2" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function Chatbot({ sessionId }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(initialMessages);
  const [chatError, setChatError] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function handleSendMessage(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    setChatHistory((previous) => [
      ...previous,
      { sender: 'user', text, time: 'Just now' },
    ]);
    setMessage('');
    setChatError('');
    setIsSending(true);

    try {
      const history = chatHistory
        .slice(-39)
        .map(({ sender, text: content }) => ({
          role: sender === 'bot' ? 'assistant' : 'user',
          content,
        }));
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: text, history }),
      });
      if (!response.ok) throw new Error(`The chat service returned ${response.status}.`);
      const data = await response.json();
      if (!data.reply) throw new Error('The chat service did not return a reply.');
      setChatHistory((previous) => [
        ...previous,
        {
          sender: 'bot',
          text: data.reply,
          resources: data.resources,
          time: 'Just now',
        },
      ]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatError('We couldn’t reach your support space just now. Your message is still here—please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="chat-card">
      <div className="chat-messages" aria-live="polite">
        <div className="day-divider"><span /> TODAY <span /></div>
        {chatHistory.map((msg, index) => (
          <div className={`message-row ${msg.sender === 'user' ? 'from-user' : 'from-bot'}`} key={`${index}-${msg.sender}`}>
            {msg.sender === 'bot' && <span className="message-avatar"><ChatIcon name="leaf" size={14} /></span>}
            <div className="message-content">
              <div className="message-bubble">{msg.text}</div>
              {msg.resources?.length > 0 && (
                <div className="resources-box">
                  <strong>Helpful resources</strong>
                  <ul>{msg.resources.map((resource, i) => <li key={`${resource}-${i}`}>{resource}</li>)}</ul>
                </div>
              )}
              <span className="message-time">{msg.time || 'Just now'}</span>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="message-row from-bot">
            <span className="message-avatar"><ChatIcon name="leaf" size={14} /></span>
            <div className="message-bubble typing-indicator">
              Finding the right words<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        {chatError && <p className="chat-error" role="alert">{chatError}</p>}
      </div>
      <div className="quick-prompts" aria-label="Suggested conversation starters">
        <button type="button" onClick={() => setMessage('I feel anxious and would like help understanding it.')}><ChatIcon name="chart" size={15} /> <span>I feel anxious</span></button>
        <button type="button" onClick={() => setMessage('I just need to vent about what is on my mind.')}><ChatIcon name="chat" size={15} /> <span>I just need to vent</span></button>
        <button type="button" onClick={() => setMessage('I am having trouble sleeping and would like some support.')}><ChatIcon name="moon" size={15} /> <span>Help me sleep</span></button>
      </div>
      <form className="chat-composer" onSubmit={handleSendMessage}>
        <input
          aria-label="Write a message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share whatever’s on your mind..."
        />
        <button type="submit" aria-label="Send message" disabled={isSending || !message.trim()}>
          <ChatIcon name="send" size={17} />
        </button>
      </form>
      <div className="chat-footer">
        <span className="composer-hint">This is a supportive space, not a substitute for professional care.</span>
        <div
          className="emergency-note"
          aria-label="If you’re in immediate danger, contact your local emergency services."
          title="If you’re in immediate danger, contact your local emergency services."
        >
          <ChatIcon name="shield" size={14} /> Need urgent help?
        </div>
      </div>
    </section>
  );
}
