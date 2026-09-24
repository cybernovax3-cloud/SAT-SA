import React, { useRef, useState } from 'react';
import { Bot, RotateCcw, Send, UserRound } from 'lucide-react';
import { postAIChat } from '../../api/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;

    setMessages((current) => [...current, { role: 'user', content: trimmedMessage }]);
    setMessage('');
    setError(null);
    setLoading(true);

    try {
      const response = await postAIChat(trimmedMessage);
      const assistantContent = response?.data?.answer ?? response?.data?.response ?? 'SAT-SA AI returned no answer.';

      setMessages((current) => [...current, {
        role: 'assistant',
        content: assistantContent,
        source: response?.data?.source,
      }]);
    } catch (requestError) {
      setError(requestError.response?.status === 503
        ? 'SAT-SA AI is currently unavailable. The deterministic SAT-SA analytics are still available.'
        : 'SAT-SA AI could not answer this request.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setMessage('');
    inputRef.current?.focus();
  };

  return (
    <section className="ai-chat-panel glass-panel">
      <div className="ai-chat-heading">
        <div className="ai-panel-heading">
          <Bot size={20} />
          <div>
            <h2>SAT-SA AI Assistant</h2>
            <p>Evidence-grounded SOC analysis</p>
          </div>
        </div>
        <button type="button" className="ai-icon-button" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="ai-chat-messages" aria-live="polite">
        {messages.length === 0 && !loading && (
          <div className="ai-chat-empty">Ask about the current SAT-SA evidence, risk, findings, or events.</div>
        )}
        {messages.map((item, index) => (
          <div className={`ai-message ${item.role}`} key={`${item.role}-${index}`}>
            <div className="ai-message-icon">{item.role === 'user' ? <UserRound size={14} /> : <Bot size={14} />}</div>
            <div className="ai-message-body">
              <span className="ai-message-label">{item.role === 'user' ? 'Analyst' : 'SAT-SA AI'}</span>
              <p>{item.content}</p>
              {item.source && <small>Evidence: {item.source.events_analyzed ?? 0} events | Risk: {item.source.risk_score ?? 0}</small>}
            </div>
          </div>
        ))}
        {loading && <div className="ai-chat-status">SAT-SA AI is analyzing security evidence...</div>}
      </div>

      {error && <div className="ai-chat-error" role="alert">{error}</div>}

      <form className="ai-chat-form" onSubmit={sendMessage}>
        <textarea
          ref={inputRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) sendMessage(event);
          }}
          placeholder="Ask about current SAT-SA evidence..."
          aria-label="Ask SAT-SA AI"
          maxLength={4000}
          rows={1}
          disabled={loading}
        />
        <button type="submit" className="ai-send-button" disabled={loading || !message.trim()}>
          <Send size={16} /> <span>Send</span>
        </button>
      </form>
    </section>
  );
};

export default AIAssistant;