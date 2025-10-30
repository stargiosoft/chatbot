// 로컬 스토리지 관리 유틸리티

const STORAGE_KEYS = {
  USER: 'fortune_user',
  FORTUNE_HISTORY: 'fortune_history',
  SHARED_FORTUNES: 'shared_fortunes',
  RECEIVED_HELPS: 'received_helps',
  WORRIES: 'worries',
  NOTIFICATIONS: 'notifications',
};

export const storage = {
  // 데이터 저장
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  // 데이터 가져오기
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  // 데이터 삭제
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },

  // 모든 데이터 삭제
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

export default STORAGE_KEYS;
