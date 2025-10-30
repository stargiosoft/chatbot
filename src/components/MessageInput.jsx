import { useState } from 'react';

function MessageInput({ message, onMessageChange, recommendedMessages = [], maxLength = 200 }) {
  const [showTemplates, setShowTemplates] = useState(true);

  const handleTemplateClick = (template) => {
    onMessageChange(template);
    setShowTemplates(false);
  };

  return (
    <div className="message-input-section">
      <div className="message-input-title">응원 메시지</div>

      {showTemplates && recommendedMessages.length > 0 && (
        <div className="message-templates">
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>추천 메시지</p>
          {recommendedMessages.slice(0, 3).map((template, index) => (
            <button key={index} className="template-button" onClick={() => handleTemplateClick(template)}>
              {template}
            </button>
          ))}
        </div>
      )}

      <textarea
        className="message-textarea"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onFocus={() => setShowTemplates(false)}
        placeholder="따뜻한 응원의 메시지를 작성해주세요..."
        maxLength={maxLength}
      />
      <div className="character-count">
        {message.length} / {maxLength}
      </div>
    </div>
  );
}

export default MessageInput;
