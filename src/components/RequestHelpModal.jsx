import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

function RequestHelpModal({ onClose, onSuccess }) {
  const { requestHelp, sharedFortunes } = useApp();
  const [worry, setWorry] = useState('');
  const [showWorryInput, setShowWorryInput] = useState(false);

  const handleSubmit = () => {
    const result = requestHelp(worry);

    if (!result.success) {
      // 조건 미충족 - 안내 팝업
      alert(result.message);
      onClose();
      return;
    }

    onSuccess(result.message);
  };

  const handleInitialRequest = () => {
    if (sharedFortunes.length === 0) {
      alert('행운을 먼저 나눠준다면 운이 나쁠 때 남들에게도 액막이를 받을 수 있을거에요.\n내일 운세가 좋을 때 다른 사람을 응원해보세요!');
      onClose();
      return;
    }

    setShowWorryInput(true);
  };

  if (!showWorryInput) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">액막이 받기</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🙏</div>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
              과거에 내가 도왔던 사람들에게
              <br />
              액막이 요청을 보낼게요
            </p>
          </div>

          <button className="submit-button" onClick={handleInitialRequest}>
            요청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">액막이 받기</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            현재 고민을 작성하면 더 빨리 도움을 받을 수 있어요 (선택사항)
          </p>
          <textarea
            className="message-textarea"
            value={worry}
            onChange={(e) => setWorry(e.target.value)}
            placeholder="예: 오늘 면접 떨어졌어요..."
            maxLength={150}
            style={{ minHeight: '120px' }}
          />
          <div className="character-count">{worry.length} / 150</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="submit-button"
            onClick={() => {
              setWorry('');
              handleSubmit();
            }}
            style={{ flex: 1, background: '#e0e0e0', color: '#666' }}
          >
            건너뛰기
          </button>
          <button className="submit-button" onClick={handleSubmit} style={{ flex: 2 }}>
            요청하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestHelpModal;
