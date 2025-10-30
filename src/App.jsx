import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import FortuneCard from './components/FortuneCard';
import ActionButtons from './components/ActionButtons';
import HelpRequestList from './components/HelpRequestList';
import HelpModal from './components/HelpModal';
import RequestHelpModal from './components/RequestHelpModal';
import Toast from './components/Toast';
import './App.css';

function AppContent() {
  const { user, todayFortune, changeNickname } = useApp();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShareFortune = () => {
    setShowHelpModal(true);
  };

  const handleRequestHelp = () => {
    setShowRequestModal(true);
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  if (!user || !todayFortune) {
    return (
      <div className="app">
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>오늘의 운세 품앗이 🔮</h1>
        <p className="subtitle">서로의 행운을 나누어요</p>
        <div className="user-info">
          <span>{user.nickname}</span>
          <button onClick={changeNickname}>닉네임 변경</button>
        </div>
      </header>

      <main className="main-content">
        <FortuneCard fortune={todayFortune} />

        <ActionButtons
          grade={todayFortune.grade}
          onShareFortune={handleShareFortune}
          onRequestHelp={handleRequestHelp}
        />

        {(todayFortune.grade === 'HIGH' || todayFortune.grade === 'MIDDLE') && (
          <HelpRequestList onSelectRequest={handleSelectRequest} />
        )}
      </main>

      {showHelpModal && (
        <HelpModal
          onClose={() => setShowHelpModal(false)}
          onSuccess={(message) => {
            setShowHelpModal(false);
            showToast(message);
          }}
        />
      )}

      {showRequestModal && (
        <RequestHelpModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={(message) => {
            setShowRequestModal(false);
            showToast(message);
          }}
        />
      )}

      {selectedRequest && (
        <HelpModal
          initialRequest={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={(message) => {
            setSelectedRequest(null);
            showToast(message);
          }}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
