from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random

db = SQLAlchemy()

class User(db.Model):
    """사용자 정보 모델"""
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(50), nullable=False)
    fortune_score = db.Column(db.Integer, nullable=False)  # 0-100 백분위 점수
    fortune_date = db.Column(db.Date, nullable=False)  # 운세 생성 날짜
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 관계
    given_fortunes = db.relationship('FortuneShare', foreign_keys='FortuneShare.giver_id', backref='giver', lazy=True)
    received_fortunes = db.relationship('FortuneShare', foreign_keys='FortuneShare.receiver_id', backref='receiver', lazy=True)
    concerns = db.relationship('Concern', backref='user', lazy=True)

    @property
    def fortune_grade(self):
        """행운 등급 계산 (상/중/하)"""
        if self.fortune_score <= 30:
            return '상'
        elif self.fortune_score <= 69:
            return '중'
        else:
            return '하'

    @property
    def can_give_fortune(self):
        """행운 나누기 가능 여부 (상, 중 등급)"""
        return self.fortune_score <= 69

    @property
    def can_receive_fortune(self):
        """액막이 받기 가능 여부 (중, 하 등급)"""
        return self.fortune_score >= 31

    @property
    def given_fortune_count(self):
        """행운을 나눠준 횟수"""
        return len([f for f in self.given_fortunes if f.created_at.date() < datetime.utcnow().date()])

    def __repr__(self):
        return f'<User {self.nickname} - {self.fortune_score}%>'


class Concern(db.Model):
    """고민 내용 모델"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.String(150), nullable=False)
    is_resolved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Concern {self.id} - {self.content[:20]}...>'


class FortuneShare(db.Model):
    """행운 나눔 기록 모델"""
    id = db.Column(db.Integer, primary_key=True)
    giver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    charm_type = db.Column(db.String(20), nullable=False)  # 행운, 위로, 힐링, 용기, 희망
    message = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 관계
    gratitudes = db.relationship('Gratitude', backref='fortune_share', lazy=True)

    def __repr__(self):
        return f'<FortuneShare {self.giver_id} -> {self.receiver_id}>'


class Gratitude(db.Model):
    """감사 인사 모델"""
    id = db.Column(db.Integer, primary_key=True)
    fortune_share_id = db.Column(db.Integer, db.ForeignKey('fortune_share.id'), nullable=False)
    message = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Gratitude {self.id}>'


class HelpRequest(db.Model):
    """액막이 요청 모델"""
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_fulfilled = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 관계
    requester = db.relationship('User', foreign_keys=[requester_id], backref='sent_requests')
    target = db.relationship('User', foreign_keys=[target_id], backref='received_requests')

    def __repr__(self):
        return f'<HelpRequest {self.requester_id} -> {self.target_id}>'


# 닉네임 생성을 위한 형용사와 명사 리스트
ADJECTIVES = [
    '행복한', '슬픈', '기쁜', '울적한', '밝은', '어두운', '따뜻한', '차가운',
    '평온한', '불안한', '용감한', '소심한', '활발한', '조용한', '긍정적인', '부정적인',
    '열정적인', '무기력한', '희망찬', '절망적인', '자신있는', '주저하는', '당당한', '수줍은'
]

NOUNS = [
    '하루', '아침', '저녁', '밤', '새벽', '정오', '오후', '순간',
    '여행자', '방랑자', '학생', '직장인', '청년', '사람', '친구', '이방인',
    '구름', '바람', '비', '눈', '햇살', '달빛', '별빛', '무지개'
]


def generate_nickname():
    """랜덤 익명 닉네임 생성"""
    return f"{random.choice(ADJECTIVES)}{random.choice(NOUNS)}"


def generate_fortune_score():
    """행운 점수 생성 (정규분포 근사)"""
    # 중앙에 몰리도록 정규분포 근사
    score = int(random.gauss(50, 20))
    # 0-100 범위로 제한
    return max(0, min(100, score))
