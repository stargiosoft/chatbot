// 전역 변수
let currentUser = null;
let selectedCharm = null;
let selectedReceiver = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

// 앱 초기화
async function initializeApp() {
    try {
        // 사용자 생성
        const response = await fetch('/api/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            renderMainScreen();
            await loadAllData();
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('앱을 시작하는 중 오류가 발생했습니다.');
    }
}

// 메인 화면 렌더링
function renderMainScreen() {
    // 로딩 화면 숨기기
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');

    // 사용자 정보 표시
    document.getElementById('user-nickname').textContent = currentUser.nickname;

    // 날짜 표시
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    document.getElementById('fortune-date').textContent = dateStr;

    // 운세 점수 표시
    document.getElementById('fortune-score').textContent = currentUser.fortune_score;

    // 운세 등급 표시
    const gradeText = currentUser.fortune_score <= 30 ? `상위 ${currentUser.fortune_score}%` :
                      currentUser.fortune_score <= 69 ? `상위 ${currentUser.fortune_score}%` :
                      `하위 ${101 - currentUser.fortune_score}%`;
    document.getElementById('fortune-grade-text').textContent = `${gradeText}의 행운을 가졌어요!`;

    const gradeElement = document.getElementById('fortune-grade');
    gradeElement.textContent = currentUser.fortune_grade;
    gradeElement.className = 'fortune-grade';
    if (currentUser.fortune_grade === '상') {
        gradeElement.classList.add('grade-high');
    } else if (currentUser.fortune_grade === '중') {
        gradeElement.classList.add('grade-medium');
    } else {
        gradeElement.classList.add('grade-low');
    }

    // 운세 설명 생성
    const description = generateFortuneDescription(currentUser.fortune_score, currentUser.fortune_grade);
    document.getElementById('fortune-description-text').textContent = description;

    // 버튼 표시/숨김
    const giveBtn = document.getElementById('give-fortune-btn');
    const receiveBtn = document.getElementById('receive-fortune-btn');

    if (currentUser.can_give_fortune) {
        giveBtn.classList.remove('hidden');
        giveBtn.addEventListener('click', openGiveFortuneModal);
    }

    if (currentUser.can_receive_fortune) {
        receiveBtn.classList.remove('hidden');
        receiveBtn.addEventListener('click', openReceiveFortuneModal);
    }

    // 메시지 입력 이벤트
    setupMessageInputs();
}

// 운세 설명 생성
function generateFortuneDescription(score, grade) {
    if (grade === '상') {
        return '오늘은 당신에게 특별히 좋은 운이 찾아왔습니다. 중요한 결정을 내리기 좋은 날이며, 새로운 도전을 시작하기에 최적의 시기입니다. 주변 사람들에게 행운을 나눠주세요!';
    } else if (grade === '중') {
        return '오늘은 평온하고 안정적인 하루가 될 것입니다. 큰 변화보다는 현재를 유지하는 것이 좋으며, 차분하게 계획을 세워보세요. 행운을 나누거나 도움을 요청할 수 있습니다.';
    } else {
        return '오늘은 조금 힘든 하루가 될 수 있습니다. 하지만 힘든 시기일수록 주변의 도움을 받는 것이 중요합니다. 용기를 내어 액막이를 요청해보세요. 곧 좋은 날이 올 것입니다!';
    }
}

// 모든 데이터 로드
async function loadAllData() {
    await Promise.all([
        loadDirectRequests(),
        loadReceivedFortunes(),
        loadStats()
    ]);
}

// 직접 요청 로드
async function loadDirectRequests() {
    try {
        const response = await fetch(`/api/help-requests/direct/${currentUser.id}`);
        const data = await response.json();

        if (data.success && data.requests.length > 0) {
            const section = document.getElementById('direct-requests-section');
            const list = document.getElementById('direct-requests-list');
            const badge = document.getElementById('direct-requests-badge');
            const countBadge = document.getElementById('request-count');

            section.classList.remove('hidden');
            badge.classList.remove('hidden');
            badge.textContent = data.requests.length;
            countBadge.textContent = `${data.requests.length}건`;

            list.innerHTML = data.requests.map(req => `
                <div class="request-card" onclick="helpDirectRequest(${req.request_id}, ${req.user.id})">
                    <div class="request-card-header">
                        <span class="request-nickname">${req.user.nickname}</span>
                        <span class="request-fortune">${req.user.fortune_grade} (${req.user.fortune_score}%)</span>
                    </div>
                    ${req.mutual_count > 0 ? `<div class="request-mutual">서로 행운을 ${req.mutual_count}번 주고받았어요</div>` : ''}
                    ${req.concern ? `<div class="request-concern">${req.concern}</div>` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading direct requests:', error);
    }
}

// 받은 행운 로드
async function loadReceivedFortunes() {
    try {
        const response = await fetch(`/api/user/${currentUser.id}/received-fortunes`);
        const data = await response.json();

        if (data.success) {
            const list = document.getElementById('received-fortunes-list');

            if (data.fortunes.length === 0) {
                list.innerHTML = '<p class="empty-message">아직 받은 행운이 없습니다.</p>';
            } else {
                list.innerHTML = data.fortunes.map(fortune => `
                    <div class="fortune-item">
                        <div class="fortune-item-header">
                            <span class="fortune-from">${fortune.giver.nickname}</span>
                            <span class="fortune-charm">${getCharmEmoji(fortune.charm_type)}</span>
                        </div>
                        <p class="fortune-message-text">${fortune.message}</p>
                        <span class="fortune-time">${fortune.created_at}</span>
                    </div>
                `).join('');

                // 감사 인사 버튼 추가
                if (data.fortunes.some(f => !f.has_gratitude)) {
                    const section = document.getElementById('received-fortunes-section');
                    const btn = document.createElement('button');
                    btn.className = 'submit-btn';
                    btn.textContent = '감사 인사 보내기';
                    btn.style.marginTop = 'var(--spacing-md)';
                    btn.onclick = openGratitudeModal;
                    section.appendChild(btn);
                }
            }
        }
    } catch (error) {
        console.error('Error loading received fortunes:', error);
    }
}

// 통계 로드
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success) {
            document.getElementById('total-users').textContent = data.stats.total_users_today;
            document.getElementById('total-shares').textContent = data.stats.total_fortune_shares;
            document.getElementById('total-concerns').textContent = data.stats.total_concerns;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// 부적 이모지 매핑
function getCharmEmoji(charmType) {
    const emojiMap = {
        '행운': '🍀',
        '위로': '💝',
        '힐링': '🌸',
        '용기': '💪',
        '희망': '⭐'
    };
    return emojiMap[charmType] || '🎁';
}

// 행운 나누기 모달 열기
async function openGiveFortuneModal() {
    try {
        const response = await fetch(`/api/matching/${currentUser.id}`);
        const data = await response.json();

        if (data.success) {
            const modal = document.getElementById('give-fortune-modal');
            const list = document.getElementById('matching-users-list');

            if (data.matched_users.length === 0) {
                list.innerHTML = '<p class="empty-message">현재 도움이 필요한 사람이 없습니다.</p>';
            } else {
                list.innerHTML = data.matched_users.map(match => `
                    <div class="matching-user-card" onclick="selectUserToHelp(${match.user.id}, '${match.user.nickname}', ${match.user.fortune_score}, '${match.user.fortune_grade}', ${match.mutual_count}, '${match.concern || ''}')">
                        <div class="matching-card-header">
                            <span class="matching-nickname">${match.user.nickname}</span>
                            <span class="matching-fortune">${match.user.fortune_grade} (${match.user.fortune_score}%)</span>
                        </div>
                        ${match.priority === 1 ? '<div class="matching-priority">고민 작성</div>' : ''}
                        ${match.mutual_count > 0 ? `<div class="matching-mutual">서로 행운을 ${match.mutual_count}번 주고받았어요</div>` : ''}
                        ${match.concern ? `<div class="matching-concern">${match.concern}</div>` : ''}
                    </div>
                `).join('');
            }

            modal.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error opening give fortune modal:', error);
        alert('도움이 필요한 사람들을 불러오는 중 오류가 발생했습니다.');
    }
}

// 도울 사용자 선택
function selectUserToHelp(userId, nickname, fortuneScore, fortuneGrade, mutualCount, concern) {
    selectedReceiver = {
        id: userId,
        nickname: nickname,
        fortune_score: fortuneScore,
        fortune_grade: fortuneGrade,
        mutual_count: mutualCount,
        concern: concern
    };

    closeGiveFortuneModal();
    openCharmModal();
}

// 직접 요청 도움
function helpDirectRequest(requestId, userId) {
    // 사용자 정보를 가져와야 하지만, 간단하게 직접 처리
    selectedReceiver = {
        id: userId,
        request_id: requestId
    };

    openCharmModal();
}

// 부적 모달 열기
function openCharmModal() {
    const modal = document.getElementById('charm-modal');
    const userInfo = document.getElementById('selected-user-info');

    userInfo.innerHTML = `
        <div class="selected-user-name">${selectedReceiver.nickname || '익명 사용자'}</div>
        ${selectedReceiver.fortune_score ? `<div class="selected-user-fortune">${selectedReceiver.fortune_grade} (${selectedReceiver.fortune_score}%)</div>` : ''}
        ${selectedReceiver.concern ? `<div class="matching-concern" style="margin-top: var(--spacing-sm)">${selectedReceiver.concern}</div>` : ''}
    `;

    // 부적 선택 이벤트
    document.querySelectorAll('.charm-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.charm-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            selectedCharm = this.getAttribute('data-charm');
        });
    });

    modal.classList.remove('hidden');
}

// 행운 보내기
async function sendFortune() {
    if (!selectedCharm) {
        alert('부적을 선택해주세요.');
        return;
    }

    const message = document.getElementById('fortune-message').value.trim();
    if (!message) {
        alert('응원 메시지를 작성해주세요.');
        return;
    }

    try {
        const response = await fetch('/api/fortune/give', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                giver_id: currentUser.id,
                receiver_id: selectedReceiver.id,
                charm_type: selectedCharm,
                message: message,
                request_id: selectedReceiver.request_id
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('행운을 성공적으로 나눴어요!');
            closeCharmModal();
            await loadAllData();
        } else {
            alert('오류가 발생했습니다: ' + data.error);
        }
    } catch (error) {
        console.error('Error sending fortune:', error);
        alert('행운을 보내는 중 오류가 발생했습니다.');
    }
}

// 액막이 받기 모달 열기
async function openReceiveFortuneModal() {
    const modal = document.getElementById('receive-fortune-modal');
    const content = document.getElementById('receive-fortune-content');

    // 행운 나눔 선행 조건 체크
    if (currentUser.given_fortune_count === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-lg);">
                <p style="margin-bottom: var(--spacing-lg); line-height: 1.8;">
                    행운을 먼저 나눠준다면 운이 나쁠 때 남들에게도 액막이를 받을 수 있을거에요.
                    내일 운세가 좋을 때 다른 사람을 응원해보세요!
                </p>
                <button class="submit-btn" onclick="closeReceiveFortuneModal()">확인</button>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="padding: var(--spacing-lg);">
                <p style="margin-bottom: var(--spacing-lg); line-height: 1.8;">
                    현재 고민을 작성하면 더 빨리 도움을 받을 수 있어요.
                </p>
                <textarea id="concern-input" class="message-textarea"
                          placeholder="고민을 작성해주세요 (선택사항, 최대 150자)"
                          maxlength="150"></textarea>
                <div class="char-count">
                    <span id="concern-char-count">0</span> / 150
                </div>
                <button class="submit-btn" style="margin-top: var(--spacing-md);" onclick="requestHelp()">
                    액막이 요청하기
                </button>
            </div>
        `;

        // 글자 수 카운트
        const textarea = document.getElementById('concern-input');
        const charCount = document.getElementById('concern-char-count');
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });
    }

    modal.classList.remove('hidden');
}

// 액막이 요청
async function requestHelp() {
    const concernInput = document.getElementById('concern-input');
    const concern = concernInput ? concernInput.value.trim() : '';

    try {
        // 고민 작성이 있으면 먼저 저장
        if (concern) {
            const concernResponse = await fetch('/api/concern/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    content: concern
                })
            });

            const concernData = await concernResponse.json();
            if (!concernData.success) {
                alert('고민 작성 중 오류가 발생했습니다.');
                return;
            }
        }

        // 액막이 요청 발송
        const response = await fetch('/api/help-request/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requester_id: currentUser.id
            })
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
            closeReceiveFortuneModal();
            await loadAllData();
        } else {
            if (data.error === 'need_to_give_first') {
                alert(data.message);
            } else {
                alert('오류가 발생했습니다: ' + data.error);
            }
        }
    } catch (error) {
        console.error('Error requesting help:', error);
        alert('액막이 요청 중 오류가 발생했습니다.');
    }
}

// 감사 인사 모달 열기
function openGratitudeModal() {
    const modal = document.getElementById('gratitude-modal');
    modal.classList.remove('hidden');

    // 템플릿 버튼 이벤트
    setupTemplateButtons('gratitude-message');
}

// 감사 인사 보내기
async function sendGratitude() {
    const message = document.getElementById('gratitude-message').value.trim();
    if (!message) {
        alert('감사 메시지를 작성해주세요.');
        return;
    }

    try {
        const response = await fetch('/api/gratitude/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUser.id,
                message: message
            })
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
            closeGratitudeModal();
            await loadReceivedFortunes();
        } else {
            alert('오류가 발생했습니다: ' + data.error);
        }
    } catch (error) {
        console.error('Error sending gratitude:', error);
        alert('감사 인사를 보내는 중 오류가 발생했습니다.');
    }
}

// 메시지 입력 설정
function setupMessageInputs() {
    // 행운 메시지
    const fortuneMessage = document.getElementById('fortune-message');
    const fortuneCharCount = document.getElementById('message-char-count');
    if (fortuneMessage && fortuneCharCount) {
        fortuneMessage.addEventListener('input', () => {
            fortuneCharCount.textContent = fortuneMessage.value.length;
        });
    }

    // 감사 메시지
    const gratitudeMessage = document.getElementById('gratitude-message');
    const gratitudeCharCount = document.getElementById('gratitude-char-count');
    if (gratitudeMessage && gratitudeCharCount) {
        gratitudeMessage.addEventListener('input', () => {
            gratitudeCharCount.textContent = gratitudeMessage.value.length;
        });
    }

    // 템플릿 버튼
    setupTemplateButtons('fortune-message');
}

// 템플릿 버튼 설정
function setupTemplateButtons(textareaId) {
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            const textarea = document.getElementById(textareaId);
            if (textarea) {
                textarea.value = template;
                // 글자 수 업데이트
                const event = new Event('input');
                textarea.dispatchEvent(event);
            }
        });
    });
}

// 모달 닫기 함수들
function closeGiveFortuneModal() {
    document.getElementById('give-fortune-modal').classList.add('hidden');
}

function closeReceiveFortuneModal() {
    document.getElementById('receive-fortune-modal').classList.add('hidden');
}

function closeCharmModal() {
    const modal = document.getElementById('charm-modal');
    modal.classList.add('hidden');

    // 초기화
    selectedCharm = null;
    document.querySelectorAll('.charm-item').forEach(i => i.classList.remove('selected'));
    document.getElementById('fortune-message').value = '';
    document.getElementById('message-char-count').textContent = '0';
}

function closeGratitudeModal() {
    const modal = document.getElementById('gratitude-modal');
    modal.classList.add('hidden');
    document.getElementById('gratitude-message').value = '';
    document.getElementById('gratitude-char-count').textContent = '0';
}

// 모달 배경 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});
