# PuppyTalk Frontend (kyjness-community-fe)

FastAPI 기반 커뮤니티 백엔드(PuppyTalk API)를 사용하는 **바닐라 JS SPA(Client Side Rendering)** 프론트엔드입니다.

- 백엔드: `PuppyTalk API` (FastAPI, 포트 8000)
- 프론트엔드: HTML + CSS + JavaScript(ES Modules) 기반 SPA
- 렌더링 방식: **CSR (Client Side Rendering)**  
  - 하나의 `index.html`만 사용하고, 나머지 화면은 JS로 동적으로 렌더링

---

## 📁 프로젝트 구조

```text
2-kyjness-community-fe/
  css/
    base.css        # 공통 리셋/타이포/컬러/기본 컴포넌트 스타일
    app.css         # 앱 전역 레이아웃 및 추가 컴포넌트 스타일

  js/
    api.js          # 공통 HTTP 클라이언트 (fetch 래퍼)
    state.js        # 전역 상태 관리 (로그인 유저, 토큰 등)
    router.js       # 해시 기반 라우터(#/login, #/posts 등)
    main.js         # 앱 진입점, 초기화

    pages/          # 페이지 단위 화면(View)
      loginPage.js       # 로그인 페이지
      signupPage.js      # 회원가입 페이지
      postListPage.js    # 게시글 목록 페이지
      postDetailPage.js  # 게시글 상세 페이지
      myPage.js          # 마이페이지(프로필 수정)

    components/     # 재사용 가능한 UI 컴포넌트(View)
      header.js          # 헤더 (사용자 메뉴 포함)
      postCard.js        # 게시글 카드 컴포넌트
      commentlist.js     # 댓글 목록 컴포넌트

  index.html        # 실제로 사용하는 단일 HTML(SSR/SSG 없음, CSR 전용)
  imt.png           # 로고 이미지
  .gitignore
  README.md
```

---

## 🧩 MVC 역할 정리 (프론트 관점)

### Model
- `js/api.js` : FastAPI REST API 호출 (로그인, 게시글, 댓글, 좋아요 등)
- `js/state.js` : 로그인 유저, 토큰, 전역 상태 저장 (localStorage 활용)

### View
- `index.html` : `<div id="app-root">`만 두고 나머지 화면은 전부 JS에서 렌더링
- `js/pages/*.js` : 페이지 단위 UI (로그인/회원가입/게시글 목록/상세 등)
- `js/components/*.js` : 재사용 UI 컴포넌트(카드/리스트/헤더 등)

### Controller
- `js/main.js` : 초기 실행, 공통 이벤트 설정
- `js/router.js` : URL(#/login 등)을 보고 어떤 페이지를 렌더링할지 결정
- 각 페이지 내부의 이벤트 핸들러들 (폼 제출, 버튼 클릭 등)

---

## ✨ 렌더링 방식 (CSR)

이 프로젝트는 **CSR(Client Side Rendering)** 방식입니다.

- 서버는 단순히 `index.html`, `css`, `js`를 제공하는 정적 서버 역할만 함
- 실제 화면은 브라우저가 JS를 실행하면서 동적으로 그려짐
- SSR(서버에서 HTML 생성), SSG(정적 생성)는 사용하지 않음

### index.html 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PuppyTalk Community</title>

  <link rel="stylesheet" href="./css/base.css" />
  <link rel="stylesheet" href="./css/app.css" />
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />

  <!-- ES Module + defer: DOM 파싱 후 JS 실행 -->
  <script type="module" src="./js/main.js" defer></script>
</head>
<body>
  <!-- SPA의 단일 렌더링 영역 -->
  <div id="app-root"></div>
</body>
</html>
```

---

## 🔗 백엔드 API 연동

**백엔드**: `http://localhost:8000`

### 주요 API 엔드포인트

#### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인

#### 게시글
- `GET /posts` - 게시글 목록 조회
- `GET /posts/{post_id}` - 게시글 상세 조회
- `POST /posts` - 게시글 작성
- `PUT /posts/{post_id}` - 게시글 수정
- `DELETE /posts/{post_id}` - 게시글 삭제

#### 댓글
- `GET /posts/{post_id}/comments` - 댓글 목록 조회
- `POST /posts/{post_id}/comments` - 댓글 작성
- `PUT /comments/{comment_id}` - 댓글 수정
- `DELETE /comments/{comment_id}` - 댓글 삭제

#### 좋아요
- `POST /posts/{post_id}/likes` - 좋아요 추가
- `DELETE /posts/{post_id}/likes` - 좋아요 취소

#### 사용자
- `GET /users/me` - 내 정보 조회
- `PUT /users/me` - 내 정보 수정
- `DELETE /users/me` - 회원 탈퇴

### API 클라이언트 사용 예시

```javascript
// js/api.js
const BASE_URL = "http://localhost:8000";

export const api = {
  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
  
  // ... put, delete 메서드도 동일
};
```

---

## 🚀 실행 방법

### 1) 백엔드 실행

```bash
cd ../2-kyjness-community-be
uvicorn main:app --reload --port 8000
```

### 2) 프론트엔드 실행 (정적 서버)

#### 방법 1: Live Server (VS Code 확장)

1. VS Code에서 `index.html` 우클릭
2. `Open with Live Server` 선택
3. 자동으로 브라우저에서 열림

#### 방법 2: Node http-server 사용

```bash
npm install -g http-server
cd 2-kyjness-community-fe
http-server .
```

브라우저에서 `http://localhost:8080` 접속

---

## 🎨 주요 기능

### ✅ 구현 완료

- **인증**: 로그인, 회원가입, 로그아웃
- **게시글**: 목록 조회, 상세 조회, 작성, 수정, 삭제
- **댓글**: 목록 조회, 작성, 수정, 삭제
- **좋아요**: 좋아요 추가/취소
- **프로필**: 프로필 조회, 수정, 회원 탈퇴
- **SPA 라우팅**: 해시 기반 라우터 (#/login, #/posts 등)
- **상태 관리**: localStorage를 활용한 로그인 상태 유지
- **반응형 디자인**: 모바일/데스크톱 대응

### 🔜 추후 개선 가능 항목

- 게시글 작성 전용 페이지 (현재는 prompt 사용)
- 이미지 업로드 기능 확장
- 페이지네이션 UI 개선
- 무한 스크롤
- 실시간 알림
- 다크 모드
- 검색 기능

---

## 📝 코드 작성 규칙

1. **모든 JS는 ES Modules 기반**(import/export)
2. **index.html에서 JS 로드**:
   ```html
   <script type="module" src="./js/main.js" defer></script>
   ```
3. **SPA 구조**: `index.html + JS`로 모든 화면 렌더링
4. **fetch 요청**: 반드시 `api.js`를 통해 수행
5. **화면 렌더링**: JS에서 DOM을 생성해서 `#app-root` 내부에 렌더링
6. **pages/**: 페이지 전체 화면 렌더링
7. **components/**: 재사용 가능한 작은 UI 조각 렌더링

---

## 🛠 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, CSS Variables
- **JavaScript (ES6+)**: ES Modules, async/await, Fetch API
- **Backend**: FastAPI (Python)
- **Font**: Pretendard, NanumSquareRound

---

## 📄 라이선스

MIT License

---

## 👥 기여

이 프로젝트는 학습 목적으로 제작되었습니다.

버그 리포트나 개선 제안은 이슈로 등록해주세요!
