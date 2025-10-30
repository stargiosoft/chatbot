import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import STORAGE_KEYS from '../utils/storage';
import { generateNickname, generateUserId } from '../utils/nickname';
import { generateFortuneScore, scoreToPercentile, getFortuneGrade } from '../utils/fortune';
import { getTodayString, isToday } from '../utils/date';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [todayFortune, setTodayFortune] = useState(null);
  const [sharedFortunes, setSharedFortunes] = useState([]);
  const [receivedHelps, setReceivedHelps] = useState([]);
  const [worries, setWorries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);

  // 초기화
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // 사용자 정보 로드 또는 생성
    let userData = storage.get(STORAGE_KEYS.USER);
    if (!userData) {
      userData = {
        id: generateUserId(),
        nickname: generateNickname(),
        createdAt: new Date().toISOString(),
      };
      storage.set(STORAGE_KEYS.USER, userData);
    }
    setUser(userData);

    // 오늘의 운세 로드 또는 생성
    const fortuneHistory = storage.get(STORAGE_KEYS.FORTUNE_HISTORY, []);
    const todayString = getTodayString();
    let todayFortuneData = fortuneHistory.find((f) => f.date === todayString);

    if (!todayFortuneData) {
      const score = generateFortuneScore();
      const percentile = scoreToPercentile(score);
      const grade = getFortuneGrade(percentile);

      todayFortuneData = {
        date: todayString,
        score,
        percentile,
        grade,
        createdAt: new Date().toISOString(),
      };

      fortuneHistory.push(todayFortuneData);
      storage.set(STORAGE_KEYS.FORTUNE_HISTORY, fortuneHistory);
    }
    setTodayFortune(todayFortuneData);

    // 나눠준 행운 기록 로드
    const shared = storage.get(STORAGE_KEYS.SHARED_FORTUNES, []);
    setSharedFortunes(shared);

    // 받은 도움 기록 로드
    const received = storage.get(STORAGE_KEYS.RECEIVED_HELPS, []);
    setReceivedHelps(received);

    // 고민 목록 로드
    const worriesData = storage.get(STORAGE_KEYS.WORRIES, []);
    setWorries(worriesData);

    // 알림 로드
    const notificationsData = storage.get(STORAGE_KEYS.NOTIFICATIONS, []);
    setNotifications(notificationsData);

    // 도움 요청 목록 로드 (시뮬레이션용 더미 데이터)
    loadHelpRequests();
  };

  // 도움 요청 목록 로드 (더미 데이터 생성)
  const loadHelpRequests = () => {
    // 실제로는 서버에서 가져와야 하지만, 로컬에서는 더미 데이터 생성
    const dummyRequests = [];
    const requestCount = Math.floor(Math.random() * 5) + 3; // 3~7개

    for (let i = 0; i < requestCount; i++) {
      const score = Math.floor(Math.random() * 40) + 60; // 60-100 (하위권)
      const percentile = scoreToPercentile(score);
      const hasWorry = Math.random() > 0.5;

      const worryTexts = [
        '오늘 면접 떨어졌어요. 너무 속상해요...',
        '상사한테 혼났어요. 제가 잘못한 것도 아닌데...',
        '발표 자료 만드는데 아이디어가 안 떠올라요 ㅠㅠ',
        '친구와 다퉜어요. 마음이 너무 힘들어요.',
        '건강이 안 좋아서 힘든 하루였어요.',
        '취업이 안 돼서 불안해요.',
        '오늘따라 모든 게 잘 안 풀려요...',
      ];

      dummyRequests.push({
        id: `request_${Date.now()}_${i}`,
        userId: generateUserId(),
        nickname: generateNickname(),
        percentile,
        score,
        grade: getFortuneGrade(percentile),
        worry: hasWorry ? worryTexts[Math.floor(Math.random() * worryTexts.length)] : null,
        requestedAt: new Date().toISOString(),
        isDirect: Math.random() > 0.7, // 30% 확률로 직접 요청
        relationCount: Math.floor(Math.random() * 3), // 0~2번 교류
      });
    }

    // 매칭 우선순위에 따라 정렬
    dummyRequests.sort((a, b) => {
      // 1. 직접 요청 우선
      if (a.isDirect && !b.isDirect) return -1;
      if (!a.isDirect && b.isDirect) return 1;

      // 2. 고민 작성자 우선
      if (a.worry && !b.worry) return -1;
      if (!a.worry && b.worry) return 1;

      // 3. 백분위가 높은 순 (하위권)
      return b.percentile - a.percentile;
    });

    setHelpRequests(dummyRequests);
  };

  // 행운 나눠주기
  const shareFortune = (targetUser, charm, message) => {
    const newShare = {
      id: `share_${Date.now()}`,
      fromUserId: user.id,
      toUserId: targetUser.userId,
      toNickname: targetUser.nickname,
      charm,
      message,
      date: getTodayString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...sharedFortunes, newShare];
    setSharedFortunes(updated);
    storage.set(STORAGE_KEYS.SHARED_FORTUNES, updated);

    // 도움 요청 목록에서 제거
    setHelpRequests((prev) => prev.filter((req) => req.id !== targetUser.id));

    // 알림 추가 (받는 사람 입장에서)
    addNotification({
      type: 'help_received',
      fromNickname: user.nickname,
      charm,
      message,
    });

    return true;
  };

  // 액막이 요청하기
  const requestHelp = (worryText) => {
    // 과거에 행운을 나눠준 적이 있는지 확인
    const sharedCount = sharedFortunes.length;

    if (sharedCount === 0) {
      return {
        success: false,
        message: '행운을 먼저 나눠준다면 운이 나쁠 때 남들에게도 액막이를 받을 수 있을거에요',
      };
    }

    // 고민 저장
    if (worryText) {
      const newWorry = {
        id: `worry_${Date.now()}`,
        text: worryText,
        date: getTodayString(),
        createdAt: new Date().toISOString(),
        resolved: false,
      };

      const updated = [...worries, newWorry];
      setWorries(updated);
      storage.set(STORAGE_KEYS.WORRIES, updated);
    }

    // 알림 추가
    addNotification({
      type: 'help_requested',
      count: sharedCount,
    });

    return {
      success: true,
      message: `행운을 나눠준 ${sharedCount}명에게 액막이 요청을 했어요`,
    };
  };

  // 고민 해결 처리
  const resolveWorry = (worryId) => {
    const updated = worries.map((w) => (w.id === worryId ? { ...w, resolved: true, resolvedAt: new Date().toISOString() } : w));

    setWorries(updated);
    storage.set(STORAGE_KEYS.WORRIES, updated);
  };

  // 감사 인사 보내기
  const sendThankYou = (message) => {
    // 나를 도와준 사람들에게 감사 인사 전송
    const helpers = receivedHelps.filter((h) => h.date === getTodayString());

    helpers.forEach((helper) => {
      addNotification({
        type: 'thanks_received',
        fromNickname: user.nickname,
        message,
      });
    });

    return helpers.length;
  };

  // 알림 추가
  const addNotification = (notification) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // 알림 읽음 처리
  const markNotificationAsRead = (notificationId) => {
    const updated = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n));

    setNotifications(updated);
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // 닉네임 변경
  const changeNickname = () => {
    const newNickname = generateNickname();
    const updated = { ...user, nickname: newNickname };
    setUser(updated);
    storage.set(STORAGE_KEYS.USER, updated);
  };

  const value = {
    user,
    todayFortune,
    sharedFortunes,
    receivedHelps,
    worries,
    notifications,
    helpRequests,
    shareFortune,
    requestHelp,
    resolveWorry,
    sendThankYou,
    addNotification,
    markNotificationAsRead,
    changeNickname,
    refreshHelpRequests: loadHelpRequests,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
