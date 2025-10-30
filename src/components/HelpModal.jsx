import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import CharmSelector from './CharmSelector';
import MessageInput from './MessageInput';
import { getRecommendedMessages } from '../data/messages';

function HelpModal({ initialRequest, onClose, onSuccess }) {
  const { helpRequests, shareFortune } = useApp();
  const [currentIndex, setCurrentIndex] = useState(
    initialRequest ? helpRequests.findIndex((r) => r.id === initialRequest.id) : 0
  );
  const [selectedCharm, setSelectedCharm] = useState(null);
  const [message, setMessage] = useState('');

  const currentRequest = helpRequests[currentIndex];

  if (!currentRequest) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">행운 나누기</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="empty-state">
            <div className="icon">🌟</div>
            <div className="text">현재 도움을 요청한 사람이 없어요</div>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!selectedCharm || !message.trim()) {
      return;
    }

    const success = shareFortune(currentRequest, selectedCharm, message);
    if (success) {
      onSuccess('행운을 성공적으로 나눴어요! 🎉');
    }
  };

  const handleNext = () => {
    if (currentIndex < helpRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedCharm(null);
      setMessage('');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedCharm(null);
      setMessage('');
    }
  };

  const recommendedMessages = getRecommendedMessages(currentRequest.worry);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">행운 나누기</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* 대상 정보 */}
        <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>{currentRequest.nickname}</span>
            <span style={{ fontSize: '12px', color: '#999' }}>
              하위 {100 - currentRequest.percentile}%
            </span>
          </div>
          {currentRequest.worry && (
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>{currentRequest.worry}</div>
          )}
        </div>

        {/* 부적 선택 */}
        <CharmSelector selectedCharm={selectedCharm} onSelectCharm={setSelectedCharm} />

        {/* 메시지 입력 */}
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          recommendedMessages={recommendedMessages}
          maxLength={200}
        />

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="submit-button"
            onClick={handleSend}
            disabled={!selectedCharm || !message.trim()}
            style={{ flex: 1 }}
          >
            보내기
          </button>
        </div>

        {/* 네비게이션 */}
        {helpRequests.length > 1 && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{
                background: 'none',
                border: 'none',
                color: currentIndex === 0 ? '#ccc' : '#667eea',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← 이전
            </button>
            <span>
              {currentIndex + 1} / {helpRequests.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === helpRequests.length - 1}
              style={{
                background: 'none',
                border: 'none',
                color: currentIndex === helpRequests.length - 1 ? '#ccc' : '#667eea',
                cursor: currentIndex === helpRequests.length - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              다음 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpModal;
