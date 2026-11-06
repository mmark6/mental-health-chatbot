import { useState } from 'react';
import './App.css'; // Importing standard CSS

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [mood, setMood] = useState(3);
  const [userId] = useState("user_" + Math.floor(Math.random() * 1000));
  const [accountType] = useState("freemium"); 

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newHistory);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message: message, account_type: accountType }),
      });
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: data.reply,
        resources: data.resources 
      }]);
    } catch (error) {
      console.error("Chat API Error:", error);
    }
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:8000/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mood_score: mood, account_type: accountType }),
      });
      alert('Mood logged successfully!');
    } catch (error) {
      console.error("Mood API Error:", error);
    }
  };

  return (
    <div className="app-container">
      
      {/* Mood Tracker Panel */}
      <div className="panel">
        <h2 className="panel-title">Daily Mood</h2>
        <form onSubmit={handleMoodSubmit} className="form-group">
          <label>How are you feeling today?</label>
          <input 
            type="range" 
            min="1" max="5" 
            value={mood} 
            onChange={(e) => setMood(parseInt(e.target.value))}
          />
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b'}}>
            <span>Low</span>
            <span>Okay</span>
            <span>Great</span>
          </div>
          <button type="submit" className="btn">Log Mood</button>
        </form>
      </div>

      {/* Chatbot Interface */}
      <div className="panel" style={{display: 'flex', flexDirection: 'column'}}>
        <h2 className="panel-title">Peer-Support Chat</h2>
        
        <div className="chat-history">
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{display: 'flex', flexDirection: 'column'}}>
              <div className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                {msg.text}
              </div>
              {msg.resources && msg.resources.length > 0 && (
                <div className="resources-box" style={{alignSelf: 'flex-start'}}>
                  <strong>Local Resources:</strong>
                  <ul style={{margin: '5px 0 0 0', paddingLeft: '20px'}}>
                    {msg.resources.map((res, i) => <li key={i}>{res}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="chat-input"
          />
          <button type="submit" className="btn" style={{backgroundColor: '#1e293b'}}>Send</button>
        </form>
      </div>

    </div>
  );
}

export default App;