import { getGradeMessage, getGradeIcon, generateFortuneMessage } from '../utils/fortune';

function FortuneCard({ fortune }) {
  const { percentile, grade } = fortune;

  return (
    <div className="fortune-card">
      <div className="icon">{getGradeIcon(grade)}</div>
      <div className="score">{getGradeMessage(grade, percentile)}</div>
      <div className="fortune-message">{generateFortuneMessage(grade)}</div>
    </div>
  );
}

export default FortuneCard;
