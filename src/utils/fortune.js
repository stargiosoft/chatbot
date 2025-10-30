// 운세 관련 유틸리티 함수

// 행운 점수 생성 (1-100)
export const generateFortuneScore = () => {
  // 정규분포를 따르는 랜덤 점수 생성 (평균 50, 표준편차 20)
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const score = Math.round(50 + 20 * z0);

  // 1-100 범위로 제한
  return Math.max(1, Math.min(100, score));
};

// 백분위 계산 (점수를 백분위로 변환)
export const scoreToPercentile = (score) => {
  return 101 - score; // 점수가 높을수록 백분위는 낮음 (상위권)
};

// 행운 등급 분류
export const getFortuneGrade = (percentile) => {
  if (percentile <= 30) return 'HIGH'; // 상
  if (percentile <= 69) return 'MIDDLE'; // 중
  return 'LOW'; // 하
};

// 등급별 메시지
export const getGradeMessage = (grade, percentile) => {
  switch (grade) {
    case 'HIGH':
      return `당신은 오늘 상위 ${percentile}%의 행운을 가졌어요! ✨`;
    case 'MIDDLE':
      return `당신은 오늘 상위 ${percentile}%의 운을 가졌어요.`;
    case 'LOW':
      return `당신은 오늘 하위 ${100 - percentile}%의 운을 가졌어요...`;
    default:
      return '운세를 확인하세요.';
  }
};

// 등급별 색상
export const getGradeColor = (grade) => {
  switch (grade) {
    case 'HIGH':
      return '#FFD700'; // 금색
    case 'MIDDLE':
      return '#87CEEB'; // 하늘색
    case 'LOW':
      return '#9B9B9B'; // 회색
    default:
      return '#000000';
  }
};

// 등급별 아이콘
export const getGradeIcon = (grade) => {
  switch (grade) {
    case 'HIGH':
      return '✨';
    case 'MIDDLE':
      return '🌟';
    case 'LOW':
      return '☁️';
    default:
      return '🔮';
  }
};

// 오늘의 운세 메시지 생성
export const generateFortuneMessage = (grade) => {
  const messages = {
    HIGH: [
      '오늘은 모든 일이 순조롭게 풀릴 거예요!',
      '좋은 소식이 기다리고 있을 거예요.',
      '당신의 긍정적인 에너지가 주변을 밝게 만들 거예요.',
      '오늘은 용기 내어 새로운 도전을 해보세요!',
    ],
    MIDDLE: [
      '평범한 하루가 될 수 있지만, 작은 행복을 찾아보세요.',
      '조금만 더 노력하면 좋은 결과를 얻을 수 있어요.',
      '주변 사람들과의 소소한 대화가 힘이 될 거예요.',
      '오늘은 여유롭게 하루를 보내세요.',
    ],
    LOW: [
      '힘든 하루가 될 수 있지만, 이 또한 지나갈 거예요.',
      '어려운 순간이지만, 당신은 충분히 강해요.',
      '오늘은 자신에게 조금 더 관대해지세요.',
      '힘들 땐 누군가의 도움을 받아도 괜찮아요.',
    ],
  };

  const gradeMessages = messages[grade] || messages.MIDDLE;
  return gradeMessages[Math.floor(Math.random() * gradeMessages.length)];
};
