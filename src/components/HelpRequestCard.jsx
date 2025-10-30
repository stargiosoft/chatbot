function HelpRequestCard({ request, onSelect }) {
  const { nickname, percentile, worry, relationCount, isDirect } = request;

  const getBadgeColor = () => {
    if (percentile >= 70) return '#f5576c';
    if (percentile >= 40) return '#ffa726';
    return '#66bb6a';
  };

  return (
    <div className="help-request-card">
      <div className="card-header">
        <div className="nickname">{nickname}</div>
        <div className="score-badge" style={{ background: getBadgeColor() }}>
          하위 {100 - percentile}%
        </div>
      </div>

      {relationCount > 0 && (
        <div className="relation-info">서로 행운을 {relationCount}번 주고받았어요</div>
      )}

      {isDirect && <div className="relation-info" style={{ color: '#667eea' }}>내게 직접 요청했어요</div>}

      {worry && <div className="worry-text">{worry}</div>}

      <button className="help-button" onClick={() => onSelect(request)}>
        이 사람 돕기
      </button>
    </div>
  );
}

export default HelpRequestCard;
