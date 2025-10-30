// 익명 닉네임 생성 유틸리티

const ADJECTIVES = [
  '행복한', '즐거운', '평화로운', '희망찬', '밝은',
  '따뜻한', '포근한', '상냥한', '다정한', '친절한',
  '씩씩한', '용감한', '당당한', '멋진', '훌륭한',
  '귀여운', '사랑스러운', '깜찍한', '앙증맞은', '소중한',
  '울적한', '우울한', '지친', '힘든', '외로운',
  '고민하는', '방황하는', '슬픈', '답답한', '막막한',
];

const NOUNS = [
  '하루', '밤', '새벽', '아침', '오후',
  '토끼', '고양이', '강아지', '새', '곰',
  '별', '달', '해', '구름', '바람',
  '꽃', '나무', '잎', '씨앗', '열매',
  '사람', '친구', '이웃', '여행자', '방랑자',
];

// 랜덤 닉네임 생성
export const generateNickname = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective}${noun}`;
};

// 사용자 ID 생성 (타임스탬프 + 랜덤)
export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
