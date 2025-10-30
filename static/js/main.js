const heroPercent = document.getElementById('heroPercent');
const heroTier = document.getElementById('heroTier');
const heroCopy = document.querySelector('.fortune-copy');
const fortuneScore = document.getElementById('fortuneScore');
const fortuneTier = document.getElementById('fortuneTier');
const fortuneMessage = document.getElementById('fortuneMessage');
const shareLuckBtn = document.getElementById('shareLuckBtn');
const requestLuckBtn = document.getElementById('requestLuckBtn');
const directRequestsPanel = document.getElementById('directRequests');
const directList = document.getElementById('directList');
const directCount = document.getElementById('directCount');
const matchingCards = document.getElementById('matchingCards');
const matchingEmpty = document.getElementById('matchingEmpty');
const amuletList = document.getElementById('amuletList');
const historyList = document.getElementById('historyList');
const historyInfo = document.getElementById('historyInfo');
const requestForm = document.getElementById('requestForm');
const concernInput = document.getElementById('concernInput');
const gratitudeStatus = document.getElementById('gratitudeStatus');
const gratitudeTemplate = document.getElementById('gratitudeTemplate');
const sendGratitudeBtn = document.getElementById('sendGratitudeBtn');
const heroButtons = document.querySelectorAll('.cta-group button');
const mobileMenuBtn = document.querySelector('.mobile-menu');
const nav = document.querySelector('.main-nav');

const AMULETS = [
  {
    name: '행운 부적',
    icon: '✨',
    description: '오늘 하루의 흐름을 부드럽게 만들어주는 기본 행운 부적입니다.'
  },
  {
    name: '위로 부적',
    icon: '🌙',
    description: '감정이 요동칠 때 마음을 다독이는 메시지와 함께 전달돼요.'
  },
  {
    name: '힐링 부적',
    icon: '🌿',
    description: '지친 몸과 마음에 잠시 숨을 고를 시간을 선물합니다.'
  },
  {
    name: '용기 부적',
    icon: '🛡️',
    description: '결정의 순간, 다시 한번 힘을 내도록 응원의 에너지를 전해요.'
  },
  {
    name: '희망 부적',
    icon: '🌅',
    description: '어두운 날에도 새로운 가능성을 바라보게 도와주는 빛입니다.'
  }
];

const scenarioConfigs = {
  high: {
    heroPercent: '15%',
    heroTier: '오늘은 상(上) 등급!',
    heroCopy: '행운을 나눠줄 준비가 되었어요. 먼저 나에게 손을 내민 사람부터 살펴볼까요?',
    scoreText: '상위 15%',
    tierLabel: '상 (上)',
    fortuneMessage: '행운이 가득한 날이에요. 나에게 직접 액막이를 요청한 사람부터 살펴보세요.',
    actions: { share: true, request: false },
    historyInfo: '지난 30일 동안 4명에게 행운을 나눴어요.',
    directRequests: [
      {
        nickname: '울적한하루',
        percentile: '하위 90%',
        tier: '하 (下)',
        relation: '서로 행운을 1번 주고받았어요',
        concern: '오늘 면접 떨어졌어요. 너무 속상해요...',
        priority: '직접 요청',
        suggestion: '면접 결과가 안 좋으셨군요. 힘내세요.'
      },
      {
        nickname: '비오는화요일',
        percentile: '하위 72%',
        tier: '하 (下)',
        relation: '지난달에 내가 먼저 응원했어요',
        concern: '오전부터 마음이 가라앉아서 누구랑도 말하기가 힘들어요.',
        priority: '직접 요청',
        suggestion: '당신의 위로가 큰 힘이 될 거예요.'
      }
    ],
    matchingQueue: [
      {
        nickname: '울적한하루',
        percentile: '하위 90%',
        tier: '하 (下)',
        concern: '오늘 면접 떨어졌어요. 너무 속상해요...',
        priority: '직접 요청',
        relation: '서로 행운을 1번 주고받았어요'
      },
      {
        nickname: '새벽기차',
        percentile: '하위 78%',
        tier: '하 (下)',
        concern: '어제부터 불면이 심해요. 마음을 다잡고 싶어요.',
        priority: '1순위',
        relation: '고민 메시지를 남겼어요'
      },
      {
        nickname: '잠깐쉼표',
        percentile: '하위 65%',
        tier: '중 (中)',
        concern: '팀 프로젝트 발표가 코앞인데 자신이 없어요.',
        priority: '2순위',
        relation: '고민 메시지는 없어요'
      }
    ],
    history: [
      {
        title: '울적한하루 님에게 액막이 전달',
        status: '응답 완료',
        time: '어제'
      },
      {
        title: '비오는화요일 님에게 응원 전송',
        status: '읽음 대기',
        time: '2일 전'
      }
    ],
    gratitude: {
      count: 2,
      names: ['울적한하루', '도란도란']
    },
    recommendedAmulets: ['용기 부적', '희망 부적']
  },
  mid: {
    heroPercent: '40%',
    heroTier: '오늘은 중(中) 등급!',
    heroCopy: '스스로도 괜찮은 하루라면, 조금 여유를 내어 낯선 이의 고민을 살펴봐요.',
    scoreText: '상위 40%',
    tierLabel: '중 (中)',
    fortuneMessage: '직접 요청이 없다면 고민을 남긴 사람부터 추천해드릴게요.',
    actions: { share: true, request: true },
    historyInfo: '지난 30일 동안 1명에게 행운을 나눴어요.',
    directRequests: [],
    matchingQueue: [
      {
        nickname: '발표두려움',
        percentile: '하위 75%',
        tier: '하 (下)',
        concern: '발표 자료 만드는데 아이디어가 안 떠올라요 ㅠㅠ',
        priority: '1순위',
        relation: '고민 메시지를 남겼어요'
      },
      {
        nickname: '울적한하루',
        percentile: '하위 90%',
        tier: '하 (下)',
        concern: '상사한테 혼났어요. 제가 잘못한 것도 아닌데...',
        priority: '1순위',
        relation: '고민 메시지를 남겼어요'
      },
      {
        nickname: '고래찾기',
        percentile: '하위 95%',
        tier: '하 (下)',
        concern: '',
        priority: '2순위',
        relation: '고민 메시지는 없어요'
      }
    ],
    history: [
      {
        title: '발표두려움 님에게 응원 예정',
        status: '보류 중',
        time: '오늘'
      }
    ],
    gratitude: {
      count: 1,
      names: ['지난달의나']
    },
    recommendedAmulets: ['위로 부적', '힐링 부적']
  },
  low: {
    heroPercent: '90%',
    heroTier: '오늘은 하(下) 등급...',
    heroCopy: '먼저 행운을 나눴던 기록이 있다면, 필요한 위로를 요청해보세요.',
    scoreText: '하위 90%',
    tierLabel: '하 (下)',
    fortuneMessage: '행운을 나눠준 기록이 확인되었어요. 고민을 작성하면 더 빠르게 도움을 받아요.',
    actions: { share: false, request: true },
    historyInfo: '이번 달에 2명에게 행운을 나눴어요.',
    directRequests: [],
    matchingQueue: [],
    history: [
      {
        title: '액막이 요청 (상사에게 혼난 날)',
        status: '응답 대기',
        time: '방금 전'
      },
      {
        title: '액막이 요청 (기분이 가라앉은 날)',
        status: '응답 완료',
        time: '3일 전'
      }
    ],
    gratitude: {
      count: 0,
      names: []
    },
    recommendedAmulets: ['희망 부적']
  }
};

function updateDirectRequests(config) {
  if (!config.directRequests || config.directRequests.length === 0) {
    directRequestsPanel.classList.add('hidden');
    directList.innerHTML = '';
    directCount.textContent = '0';
    return;
  }

  directRequestsPanel.classList.remove('hidden');
  directList.innerHTML = '';
  directCount.textContent = config.directRequests.length;

  config.directRequests.forEach((request) => {
    const item = document.createElement('li');
    item.className = 'request-card';

    const header = document.createElement('div');
    header.className = 'request-header';
    header.innerHTML = `
      <strong>${request.nickname}</strong>
      <span class="percent-chip">${request.percentile} · ${request.tier}</span>
    `;

    const meta = document.createElement('div');
    meta.className = 'request-meta';
    meta.innerHTML = `
      <span>${request.relation}</span>
      <span class="priority-pill">${request.priority}</span>
    `;

    const concern = document.createElement('p');
    concern.className = 'concern-preview';
    concern.textContent = request.concern;

    const actions = document.createElement('div');
    actions.className = 'request-actions';

    const helpBtn = document.createElement('button');
    helpBtn.className = 'primary';
    helpBtn.textContent = '이 사람 돕기';
    helpBtn.addEventListener('click', () => {
      window.scrollTo({ top: matchingCards.offsetTop - 80, behavior: 'smooth' });
    });

    const suggest = document.createElement('button');
    suggest.className = 'secondary';
    suggest.textContent = '추천 메시지 보기';
    suggest.addEventListener('click', () => {
      alert(`${request.nickname} 님에게\n추천 문장: ${request.suggestion}`);
    });

    actions.append(helpBtn, suggest);

    item.append(header, meta, concern, actions);
    directList.appendChild(item);
  });
}

function updateMatchingQueue(config) {
  matchingCards.innerHTML = '';

  if (!config.matchingQueue || config.matchingQueue.length === 0) {
    matchingEmpty.style.display = 'block';
    return;
  }

  matchingEmpty.style.display = 'none';

  config.matchingQueue.forEach((match) => {
    const card = document.createElement('article');
    card.className = 'match-card';

    card.innerHTML = `
      <header>
        <strong>${match.nickname}</strong>
        <span class="priority-pill">${match.priority}</span>
      </header>
      <div class="request-meta">
        <span class="percent-chip">${match.percentile} · ${match.tier}</span>
        <span>${match.relation}</span>
      </div>
      <p class="concern-preview">${match.concern || '고민 메시지가 없는 사용자예요. 가벼운 응원을 건네보세요.'}</p>
      <div class="request-actions">
        <button class="primary">이 사람 돕기</button>
        <button class="ghost">다음 카드 보기</button>
      </div>
    `;

    const [helpBtn, skipBtn] = card.querySelectorAll('button');

    helpBtn.addEventListener('click', () => {
      alert(`${match.nickname} 님에게 응원을 보냈어요!`);
    });

    skipBtn.addEventListener('click', () => {
      card.classList.add('hidden');
      const visibleCards = [...matchingCards.children].filter((child) => !child.classList.contains('hidden'));
      if (visibleCards.length === 0) {
        matchingEmpty.style.display = 'block';
      }
    });

    matchingCards.appendChild(card);
  });
}

function updateAmulets(config) {
  amuletList.innerHTML = '';

  AMULETS.forEach((amulet) => {
    const item = document.createElement('li');
    item.className = 'amulet-card';
    if (config.recommendedAmulets?.includes(amulet.name)) {
      item.classList.add('recommended');
    }

    item.innerHTML = `
      <div class="amulet-icon">${amulet.icon}</div>
      <div class="amulet-content">
        <h4>${amulet.name}</h4>
        <p>${amulet.description}</p>
      </div>
    `;

    amuletList.appendChild(item);
  });
}

function updateHistory(config) {
  historyList.innerHTML = '';

  config.history.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <strong>${item.title}</strong>
      <div class="history-meta">
        <span>${item.status}</span>
        <span>${item.time}</span>
      </div>
    `;
    historyList.appendChild(li);
  });
}

function updateGratitude(config) {
  const count = config.gratitude.count;
  if (count > 0) {
    gratitudeStatus.textContent = `${config.gratitude.names.join(', ')} 님에게 감사 인사를 보낼 수 있어요.`;
    sendGratitudeBtn.disabled = false;
  } else {
    gratitudeStatus.textContent = '보낼 감사 인사가 0건 있어요.';
    sendGratitudeBtn.disabled = true;
  }
}

function updateActions(config) {
  shareLuckBtn.disabled = !config.actions.share;
  requestLuckBtn.disabled = !config.actions.request;
}

function updateHeroState(config) {
  heroPercent.textContent = config.heroPercent;
  heroTier.textContent = config.heroTier;
  heroCopy.textContent = config.heroCopy;
}

function updateFortuneCard(config) {
  fortuneScore.textContent = config.scoreText;
  fortuneTier.textContent = config.tierLabel;
  fortuneMessage.textContent = config.fortuneMessage;
}

function updateScenario(stateKey) {
  const config = scenarioConfigs[stateKey];
  if (!config) return;

  heroButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.state === stateKey));

  updateHeroState(config);
  updateFortuneCard(config);
  updateActions(config);
  updateDirectRequests(config);
  updateMatchingQueue(config);
  updateAmulets(config);
  updateHistory(config);
  updateGratitude(config);
  historyInfo.textContent = config.historyInfo;

  requestForm.dataset.state = stateKey;
}

heroButtons.forEach((button) => {
  button.addEventListener('click', () => {
    updateScenario(button.dataset.state);
    document.getElementById('fortune').scrollIntoView({ behavior: 'smooth' });
  });
});

shareLuckBtn.addEventListener('click', () => {
  document.getElementById('matching').scrollIntoView({ behavior: 'smooth' });
});

requestLuckBtn.addEventListener('click', () => {
  document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
});

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const currentState = requestForm.dataset.state;
  const config = scenarioConfigs[currentState];
  const concern = concernInput.value.trim();
  const message = concern ? `고민을 함께 보냈어요: ${concern}` : '고민 없이 액막이 요청을 보냈어요.';
  alert(`행운을 나눠준 ${config.history.length}명에게 액막이 요청을 전송했어요.\n${message}`);
  concernInput.value = '';
});

sendGratitudeBtn.addEventListener('click', () => {
  if (sendGratitudeBtn.disabled) return;
  const template = gratitudeTemplate.value;
  alert(`선택한 ${template} 메시지로 감사 인사를 전송했어요.`);
});

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

updateScenario('high');
