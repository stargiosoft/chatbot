// 부적 아이템 데이터

export const CHARMS = [
  {
    id: 'luck',
    name: '행운의 부적',
    icon: '🍀',
    color: '#4CAF50',
    description: '당신에게 행운이 가득하기를',
  },
  {
    id: 'comfort',
    name: '위로의 부적',
    icon: '💚',
    color: '#81C784',
    description: '따뜻한 위로를 전합니다',
  },
  {
    id: 'healing',
    name: '힐링의 부적',
    icon: '🌸',
    color: '#F48FB1',
    description: '당신의 마음이 치유되기를',
  },
  {
    id: 'courage',
    name: '용기의 부적',
    icon: '⚡',
    color: '#FFB74D',
    description: '용기를 내어 나아가세요',
  },
  {
    id: 'hope',
    name: '희망의 부적',
    icon: '✨',
    color: '#64B5F6',
    description: '희망의 빛이 당신을 비추길',
  },
];

export const getCharmById = (id) => {
  return CHARMS.find((charm) => charm.id === id);
};
