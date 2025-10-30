import { CHARMS } from '../data/charms';

function CharmSelector({ selectedCharm, onSelectCharm }) {
  return (
    <div className="charm-selector">
      <div className="charm-selector-title">부적 선택</div>
      <div className="charm-list">
        {CHARMS.map((charm) => (
          <div
            key={charm.id}
            className={`charm-item ${selectedCharm?.id === charm.id ? 'selected' : ''}`}
            onClick={() => onSelectCharm(charm)}
            title={charm.description}
          >
            <div className="icon">{charm.icon}</div>
            <div className="name">{charm.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharmSelector;
