import { useApp } from '../contexts/AppContext';
import HelpRequestCard from './HelpRequestCard';

function HelpRequestList({ onSelectRequest }) {
  const { helpRequests } = useApp();

  if (helpRequests.length === 0) {
    return (
      <div className="section">
        <h2 className="section-title">도움이 필요한 사람들</h2>
        <div className="empty-state">
          <div className="icon">🌟</div>
          <div className="text">현재 도움을 요청한 사람이 없어요</div>
        </div>
      </div>
    );
  }

  // 직접 요청과 일반 요청 분리
  const directRequests = helpRequests.filter((req) => req.isDirect);
  const generalRequests = helpRequests.filter((req) => !req.isDirect);

  return (
    <div className="section">
      {directRequests.length > 0 && (
        <>
          <h2 className="section-title">액막이 요청 ({directRequests.length})</h2>
          {directRequests.map((request) => (
            <HelpRequestCard key={request.id} request={request} onSelect={onSelectRequest} />
          ))}
        </>
      )}

      {generalRequests.length > 0 && (
        <>
          <h2 className="section-title">도움이 필요한 사람들</h2>
          {generalRequests.slice(0, 5).map((request) => (
            <HelpRequestCard key={request.id} request={request} onSelect={onSelectRequest} />
          ))}
        </>
      )}
    </div>
  );
}

export default HelpRequestList;
