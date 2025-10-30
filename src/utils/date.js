// 날짜 관련 유틸리티 함수

// 오늘 날짜 문자열 (YYYY-MM-DD)
export const getTodayString = () => {
  const today = new Date();
  return formatDate(today);
};

// Date 객체를 YYYY-MM-DD 형식으로 변환
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 날짜 문자열 비교
export const isSameDate = (date1, date2) => {
  return formatDate(new Date(date1)) === formatDate(new Date(date2));
};

// 오늘인지 확인
export const isToday = (dateString) => {
  return dateString === getTodayString();
};

// 상대 시간 표시 (몇 시간 전, 며칠 전 등)
export const getRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

// 날짜 표시 형식 (오늘, 어제, MM/DD)
export const getDisplayDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDate(date, today)) return '오늘';
  if (isSameDate(date, yesterday)) return '어제';

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};
