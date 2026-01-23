import { api } from './api.js';

/**
 * 인증 관련 기능 초기화
 * 로그인 폼 제출 및 회원가입 버튼 이벤트 등록
 */
export function initAuth() {
  // 로그인 폼 제출 이벤트 등록
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // 회원가입 버튼 클릭 시 회원가입 페이지로 이동
  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      window.location.href = './signup.html';
    });
  }
}

/**
 * 로그인 폼 제출 처리
 * @param {Event} e - 폼 제출 이벤트
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  const email = formData.get('email');
  const password = formData.get('password');

  // 입력값 검증
  if (!email || !password) {
    showError('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  const data = {
    email: email,
    password: password
  };

  try {
    // 로딩 상태 표시 - 버튼 텍스트 변경 및 비활성화
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '로그인 중...';
    submitBtn.disabled = true;

    // 로그인 API 호출
    const result = await api.post('/auth/login', data);
    
    // 로그인 성공 시 메인 페이지로 이동
    alert('로그인 성공!');
    window.location.href = '/';
    
  } catch (error) {
    // 에러 처리 - 에러 메시지 표시
    const errorMessage = error.message || '로그인에 실패했습니다.';
    showError(errorMessage);
    
    // Helper Text에 에러 메시지 표시
    const helperText = document.querySelector('.helper-text');
    if (helperText) {
      helperText.textContent = `* ${errorMessage}`;
      helperText.style.display = 'block';
    }
  } finally {
    // 버튼 상태 복원 - 성공/실패 관계없이 원래 상태로 복구
    const submitBtn = form.querySelector('.btn-primary');
    submitBtn.textContent = '로그인';
    submitBtn.disabled = false;
  }
}

/**
 * 에러 메시지 표시 (현재는 alert 사용, 추후 UI 개선 가능)
 * @param {string} message - 에러 메시지
 */
function showError(message) {
  alert(message);
}
