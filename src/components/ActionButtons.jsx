function ActionButtons({ grade, onShareFortune, onRequestHelp }) {
  const canShare = grade === 'HIGH' || grade === 'MIDDLE';
  const canRequest = grade === 'MIDDLE' || grade === 'LOW';

  return (
    <div className="action-buttons">
      {canShare && (
        <button className="action-button primary" onClick={onShareFortune}>
          <span className="icon">🎁</span>
          <span>행운 나누기</span>
        </button>
      )}
      {canRequest && (
        <button className="action-button secondary" onClick={onRequestHelp}>
          <span className="icon">🙏</span>
          <span>액막이 받기</span>
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
