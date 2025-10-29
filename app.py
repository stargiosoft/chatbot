from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from datetime import datetime, date
import os
from models import db, User, Concern, FortuneShare, Gratitude, HelpRequest
from models import generate_nickname, generate_fortune_score
from sqlalchemy import func, and_, or_

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fortune-sharing-secret-key-2024')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fortune_sharing.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

# 데이터베이스 초기화
db.init_app(app)

# 데이터베이스 테이블 생성
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    """메인 페이지"""
    return render_template('index.html')


@app.route('/api/user/create', methods=['POST'])
def create_user():
    """새로운 사용자 생성 (오늘의 운세 생성)"""
    try:
        nickname = generate_nickname()
        fortune_score = generate_fortune_score()
        today = date.today()

        # 새 사용자 생성
        user = User(
            nickname=nickname,
            fortune_score=fortune_score,
            fortune_date=today
        )
        db.session.add(user)
        db.session.commit()

        # 세션에 사용자 ID 저장
        session['user_id'] = user.id

        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'nickname': user.nickname,
                'fortune_score': user.fortune_score,
                'fortune_grade': user.fortune_grade,
                'can_give_fortune': user.can_give_fortune,
                'can_receive_fortune': user.can_receive_fortune
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """사용자 정보 조회"""
    try:
        user = User.query.get_or_404(user_id)

        # 직접 요청 카운트
        today = date.today()
        direct_requests = HelpRequest.query.filter_by(
            target_id=user_id,
            is_fulfilled=False
        ).join(User, HelpRequest.requester_id == User.id).filter(
            User.fortune_date == today
        ).count()

        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'nickname': user.nickname,
                'fortune_score': user.fortune_score,
                'fortune_grade': user.fortune_grade,
                'can_give_fortune': user.can_give_fortune,
                'can_receive_fortune': user.can_receive_fortune,
                'given_fortune_count': user.given_fortune_count,
                'direct_requests_count': direct_requests
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/help-requests/direct/<int:user_id>', methods=['GET'])
def get_direct_help_requests(user_id):
    """나에게 직접 온 액막이 요청 목록"""
    try:
        today = date.today()

        # 나에게 직접 온 요청들
        requests = HelpRequest.query.filter_by(
            target_id=user_id,
            is_fulfilled=False
        ).all()

        result = []
        for req in requests:
            requester = User.query.get(req.requester_id)
            if requester and requester.fortune_date == today:
                # 서로 주고받은 횟수 계산
                mutual_count = FortuneShare.query.filter(
                    or_(
                        and_(FortuneShare.giver_id == user_id, FortuneShare.receiver_id == requester.id),
                        and_(FortuneShare.giver_id == requester.id, FortuneShare.receiver_id == user_id)
                    )
                ).count()

                # 고민 내용 조회
                concern = Concern.query.filter_by(
                    user_id=requester.id,
                    is_resolved=False
                ).order_by(Concern.created_at.desc()).first()

                result.append({
                    'request_id': req.id,
                    'user': {
                        'id': requester.id,
                        'nickname': requester.nickname,
                        'fortune_score': requester.fortune_score,
                        'fortune_grade': requester.fortune_grade
                    },
                    'mutual_count': mutual_count,
                    'concern': concern.content if concern else None
                })

        return jsonify({'success': True, 'requests': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/matching/<int:user_id>', methods=['GET'])
def get_matching_users(user_id):
    """매칭 알고리즘에 따른 도움이 필요한 사용자 목록"""
    try:
        today = date.today()
        user = User.query.get_or_404(user_id)

        # 나에게 직접 요청한 사람들은 제외
        direct_request_ids = [req.requester_id for req in HelpRequest.query.filter_by(
            target_id=user_id,
            is_fulfilled=False
        ).all()]

        # 1순위: 고민 메시지를 작성한 중, 하 등급 사용자
        priority1 = db.session.query(User).join(Concern).filter(
            User.fortune_date == today,
            User.id != user_id,
            User.id.notin_(direct_request_ids),
            User.fortune_score >= 31,  # 중, 하 등급
            Concern.is_resolved == False
        ).order_by(User.fortune_score.desc()).all()

        # 2순위: 하 등급 사용자 (고민 작성 여부 무관)
        priority2 = User.query.filter(
            User.fortune_date == today,
            User.id != user_id,
            User.id.notin_(direct_request_ids),
            User.fortune_score >= 70,  # 하 등급
            User.id.notin_([u.id for u in priority1])
        ).order_by(User.fortune_score.desc()).all()

        # 결과 조합
        matched_users = priority1 + priority2

        result = []
        for matched_user in matched_users[:20]:  # 최대 20명
            concern = Concern.query.filter_by(
                user_id=matched_user.id,
                is_resolved=False
            ).order_by(Concern.created_at.desc()).first()

            # 서로 주고받은 횟수
            mutual_count = FortuneShare.query.filter(
                or_(
                    and_(FortuneShare.giver_id == user_id, FortuneShare.receiver_id == matched_user.id),
                    and_(FortuneShare.giver_id == matched_user.id, FortuneShare.receiver_id == user_id)
                )
            ).count()

            result.append({
                'user': {
                    'id': matched_user.id,
                    'nickname': matched_user.nickname,
                    'fortune_score': matched_user.fortune_score,
                    'fortune_grade': matched_user.fortune_grade
                },
                'concern': concern.content if concern else None,
                'mutual_count': mutual_count,
                'priority': 1 if matched_user in priority1 else 2
            })

        return jsonify({'success': True, 'matched_users': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/fortune/give', methods=['POST'])
def give_fortune():
    """행운 나누기 (부적 + 메시지 전달)"""
    try:
        data = request.json
        giver_id = data.get('giver_id')
        receiver_id = data.get('receiver_id')
        charm_type = data.get('charm_type')
        message = data.get('message')
        request_id = data.get('request_id')  # 직접 요청인 경우

        if not all([giver_id, receiver_id, charm_type, message]):
            return jsonify({'success': False, 'error': '필수 정보가 누락되었습니다.'}), 400

        # 행운 나눔 기록 생성
        fortune_share = FortuneShare(
            giver_id=giver_id,
            receiver_id=receiver_id,
            charm_type=charm_type,
            message=message
        )
        db.session.add(fortune_share)

        # 직접 요청인 경우 요청 완료 처리
        if request_id:
            help_request = HelpRequest.query.get(request_id)
            if help_request:
                help_request.is_fulfilled = True

        db.session.commit()

        return jsonify({'success': True, 'fortune_share_id': fortune_share.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/concern/create', methods=['POST'])
def create_concern():
    """고민 작성"""
    try:
        data = request.json
        user_id = data.get('user_id')
        content = data.get('content')

        if not user_id or not content:
            return jsonify({'success': False, 'error': '필수 정보가 누락되었습니다.'}), 400

        if len(content) > 150:
            return jsonify({'success': False, 'error': '고민 내용은 150자 이하로 작성해주세요.'}), 400

        concern = Concern(
            user_id=user_id,
            content=content
        )
        db.session.add(concern)
        db.session.commit()

        return jsonify({'success': True, 'concern_id': concern.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/concern/<int:concern_id>/resolve', methods=['POST'])
def resolve_concern(concern_id):
    """고민 해결 처리"""
    try:
        concern = Concern.query.get_or_404(concern_id)
        concern.is_resolved = True
        concern.resolved_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/help-request/create', methods=['POST'])
def create_help_request():
    """액막이 요청 생성"""
    try:
        data = request.json
        requester_id = data.get('requester_id')

        if not requester_id:
            return jsonify({'success': False, 'error': '필수 정보가 누락되었습니다.'}), 400

        user = User.query.get_or_404(requester_id)

        # 행운 나눔 선행 조건 체크
        if user.given_fortune_count == 0:
            return jsonify({
                'success': False,
                'error': 'need_to_give_first',
                'message': '행운을 먼저 나눠준다면 운이 나쁠 때 남들에게도 액막이를 받을 수 있을거에요'
            }), 400

        # 과거에 내가 행운을 나눠준 사람들에게 요청 발송
        given_users = db.session.query(FortuneShare.receiver_id).filter_by(
            giver_id=requester_id
        ).distinct().all()

        today = date.today()
        request_count = 0

        for (receiver_id,) in given_users:
            # 오늘 날짜의 사용자에게만 요청
            receiver = User.query.get(receiver_id)
            if receiver and receiver.fortune_date == today:
                # 이미 요청이 있는지 확인
                existing = HelpRequest.query.filter_by(
                    requester_id=requester_id,
                    target_id=receiver_id,
                    is_fulfilled=False
                ).first()

                if not existing:
                    help_request = HelpRequest(
                        requester_id=requester_id,
                        target_id=receiver_id
                    )
                    db.session.add(help_request)
                    request_count += 1

        db.session.commit()

        return jsonify({
            'success': True,
            'request_count': request_count,
            'message': f'행운을 나눠준 {request_count}명에게 액막이 요청을 했어요'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/gratitude/send', methods=['POST'])
def send_gratitude():
    """감사 인사 보내기"""
    try:
        data = request.json
        user_id = data.get('user_id')
        message = data.get('message')

        if not user_id or not message:
            return jsonify({'success': False, 'error': '필수 정보가 누락되었습니다.'}), 400

        if len(message) > 100:
            return jsonify({'success': False, 'error': '감사 메시지는 100자 이하로 작성해주세요.'}), 400

        # 나에게 행운을 나눠준 사람들에게 감사 인사 전송
        received_shares = FortuneShare.query.filter_by(
            receiver_id=user_id
        ).filter(
            ~FortuneShare.id.in_(
                db.session.query(Gratitude.fortune_share_id)
            )
        ).all()

        gratitude_count = 0
        for share in received_shares:
            gratitude = Gratitude(
                fortune_share_id=share.id,
                message=message
            )
            db.session.add(gratitude)
            gratitude_count += 1

        db.session.commit()

        return jsonify({
            'success': True,
            'gratitude_count': gratitude_count,
            'message': f'{gratitude_count}명에게 감사 인사를 보냈어요'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/user/<int:user_id>/received-fortunes', methods=['GET'])
def get_received_fortunes(user_id):
    """받은 행운 목록"""
    try:
        fortunes = FortuneShare.query.filter_by(receiver_id=user_id).order_by(
            FortuneShare.created_at.desc()
        ).all()

        result = []
        for fortune in fortunes:
            giver = User.query.get(fortune.giver_id)
            gratitude = Gratitude.query.filter_by(fortune_share_id=fortune.id).first()

            result.append({
                'id': fortune.id,
                'giver': {
                    'nickname': giver.nickname if giver else '알 수 없음'
                },
                'charm_type': fortune.charm_type,
                'message': fortune.message,
                'created_at': fortune.created_at.strftime('%Y-%m-%d %H:%M'),
                'has_gratitude': gratitude is not None
            })

        return jsonify({'success': True, 'fortunes': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/user/<int:user_id>/concerns', methods=['GET'])
def get_user_concerns(user_id):
    """사용자의 고민 목록"""
    try:
        concerns = Concern.query.filter_by(user_id=user_id).order_by(
            Concern.created_at.desc()
        ).all()

        result = []
        for concern in concerns:
            # 이 고민에 대해 받은 응원 개수
            support_count = FortuneShare.query.filter_by(
                receiver_id=user_id
            ).filter(
                FortuneShare.created_at >= concern.created_at
            ).count()

            result.append({
                'id': concern.id,
                'content': concern.content,
                'is_resolved': concern.is_resolved,
                'created_at': concern.created_at.strftime('%Y-%m-%d %H:%M'),
                'resolved_at': concern.resolved_at.strftime('%Y-%m-%d %H:%M') if concern.resolved_at else None,
                'support_count': support_count
            })

        return jsonify({'success': True, 'concerns': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """전체 통계"""
    try:
        today = date.today()

        total_users_today = User.query.filter_by(fortune_date=today).count()
        total_fortune_shares = FortuneShare.query.count()
        total_concerns = Concern.query.filter_by(is_resolved=False).count()

        return jsonify({
            'success': True,
            'stats': {
                'total_users_today': total_users_today,
                'total_fortune_shares': total_fortune_shares,
                'total_concerns': total_concerns
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
