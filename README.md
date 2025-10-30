# 운세 품앗이 웹앱

## 로컬 실행 준비
1. **Python** 3.10 이상이 설치되어 있는지 확인합니다.
2. (선택) 프로젝트 루트에서 가상환경을 생성하고 활성화합니다.
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
   ```
3. 필요한 패키지를 설치합니다.
   ```bash
   pip install flask flask-cors openai python-dotenv
   ```
   > OpenAI 연동이 필요 없다면 `openai`, `python-dotenv`는 생략해도 됩니다.

## 환경 변수 설정 (선택)
OpenAI API를 연결하려면 프로젝트 루트에 `.env` 파일을 만들고 아래 내용을 추가합니다.
```env
OPENAI_API_KEY=sk-...
```
환경 변수를 지정하지 않으면 `/api/fortune` 엔드포인트가 기본 제공 문구로 응답합니다.

## 서버 실행
프로젝트 루트에서 아래 명령을 실행합니다.
```bash
python app.py
```
기본적으로 `0.0.0.0` 호스트의 `5001` 포트에서 Flask 서버가 실행됩니다.
동일한 컴퓨터에서 접속할 때는 브라우저 주소창에 아래 주소를 입력하면 됩니다.
- http://localhost:5001
- http://127.0.0.1:5001

다른 포트로 실행하고 싶다면 실행 전에 `PORT` 환경 변수를 지정하세요.
```bash
PORT=8000 python app.py
```

## 프런트엔드 자산
- 정적 파일: `static/`
- 템플릿: `templates/index.html`

Flask 서버를 기동하면 기본 템플릿이 함께 서빙되어 바로 웹페이지를 확인할 수 있습니다.
