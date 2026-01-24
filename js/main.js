/**
 * 앱 진입점 (Entry Point)
 * 앱 초기화 및 공통 이벤트 설정
 */

import { restoreUser } from './state.js';
import { initRouter } from './router.js';

/**
 * 앱 초기화
 */
function initApp() {
  // 1. 로컬 스토리지에서 사용자 정보 복원 (로그인 상태 유지)
  restoreUser();
  
  // 2. 라우터 초기화 (해시 변경 이벤트 등록 및 초기 라우팅)
  initRouter();
  
  // 3. 전역 에러 핸들러 등록
  window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
  });
  
  // 4. 네트워크 에러 핸들러 (fetch 실패 등)
  window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 에러:', event.reason);
  });
}

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', initApp);
