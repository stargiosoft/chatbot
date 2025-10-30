// 응원 메시지 템플릿

export const MESSAGE_TEMPLATES = {
  // 일반 응원
  general: [
    '힘내세요! 당신은 충분히 잘하고 있어요.',
    '오늘 하루도 수고 많으셨어요. 응원합니다!',
    '괜찮아요. 천천히 가도 괜찮습니다.',
    '당신은 생각보다 훨씬 강한 사람이에요.',
    '힘들 땐 잠시 쉬어가도 괜찮아요. 응원합니다!',
  ],

  // 직장/업무 관련
  work: [
    '직장 생활이 힘드시죠. 당신의 노력을 알고 있어요.',
    '상사의 말에 상처받지 마세요. 당신은 잘하고 있어요.',
    '업무 스트레스가 많으시군요. 오늘 하루만이라도 편히 쉬세요.',
    '힘든 하루였네요. 내일은 더 좋은 날이 될 거예요.',
  ],

  // 시험/면접 관련
  exam: [
    '좋은 결과가 없었나요? 더 좋은 기회가 올 거예요!',
    '떨어졌다고 당신의 가치가 떨어지는 건 아니에요.',
    '실패는 성공의 어머니라고 했어요. 다시 도전해보세요!',
    '이번엔 안 됐지만, 다음번엔 꼭 될 거예요. 응원합니다!',
  ],

  // 인간관계 관련
  relationship: [
    '사람 관계가 힘드시군요. 당신 잘못이 아니에요.',
    '모든 사람과 잘 지낼 순 없어요. 너무 자책하지 마세요.',
    '당신을 이해해주는 사람이 분명 있을 거예요.',
    '혼자가 외롭지만, 그것도 괜찮아요. 응원합니다.',
  ],

  // 건강 관련
  health: [
    '건강이 안 좋으시군요. 푹 쉬시고 빨리 나으시길 바래요.',
    '몸이 힘들 땐 마음도 힘들죠. 무리하지 마세요.',
    '건강이 최우선이에요. 오늘은 쉬세요.',
  ],

  // 경제적 어려움
  money: [
    '경제적으로 힘드시군요. 조금만 버티면 나아질 거예요.',
    '돈 때문에 힘드시죠. 당신만 그런 게 아니에요.',
    '어려운 시기지만, 꼭 좋은 날이 올 거예요.',
  ],

  // 감사 응답용
  thanks: [
    '도움이 되었다니 기뻐요!',
    '힘이 되셨다니 저도 행복해요.',
    '별 거 아니에요. 서로 힘이 되어요!',
    '당신도 힘든 날엔 언제든 말씀하세요.',
  ],
};

// 고민 키워드에 따른 적절한 템플릿 추천
export const getRecommendedMessages = (worryText) => {
  if (!worryText) return MESSAGE_TEMPLATES.general;

  const text = worryText.toLowerCase();

  if (text.includes('상사') || text.includes('회사') || text.includes('직장') || text.includes('업무')) {
    return MESSAGE_TEMPLATES.work;
  }

  if (text.includes('면접') || text.includes('시험') || text.includes('떨어') || text.includes('불합격')) {
    return MESSAGE_TEMPLATES.exam;
  }

  if (text.includes('친구') || text.includes('사람') || text.includes('관계') || text.includes('외로')) {
    return MESSAGE_TEMPLATES.relationship;
  }

  if (text.includes('아프') || text.includes('건강') || text.includes('병') || text.includes('피곤')) {
    return MESSAGE_TEMPLATES.health;
  }

  if (text.includes('돈') || text.includes('월급') || text.includes('빚') || text.includes('경제')) {
    return MESSAGE_TEMPLATES.money;
  }

  return MESSAGE_TEMPLATES.general;
};
