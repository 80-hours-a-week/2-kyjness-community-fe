/**
 * 마이페이지 (프로필 수정)
 */

import { api } from '../api.js';
import { getUser, updateUser, clearUser } from '../state.js';
import { navigateTo } from '../router.js';
import { renderHeader, initHeaderEvents } from '../components/header.js';

/**
 * 마이페이지 렌더링
 */
export function renderMyPage() {
  const root = document.getElementById('app-root');
  const user = getUser();
  
  if (!user) {
    navigateTo('/login');
    return;
  }
  
  root.innerHTML = `
    ${renderHeader()}
    
    <main class="profile-main main">
      <div class="profile-container">
        <h2 class="profile-title">회원정보 수정</h2>
        
        <form id="profile-form" class="profile-form">
          <!-- 프로필 사진 -->
          <div class="profile-photo-group">
            <label class="profile-label">프로필 사진</label>
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar" id="avatar-container">
                ${user.profileImageUrl 
                  ? `<img src="${user.profileImageUrl}" class="profile-avatar-img" id="avatar-img" />`
                  : `<div class="profile-avatar-img" id="avatar-img" style="background-color: #c4c4c4;"></div>`
                }
              </div>
              <button type="button" id="edit-photo-btn" class="profile-edit-btn">편집</button>
              <input type="file" id="profile-image" accept="image/*" style="display: none;" />
            </div>
          </div>
          
          <!-- 이메일 (읽기 전용) -->
          <div class="profile-form-group">
            <label for="email" class="profile-label">이메일</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="profile-input profile-input-readonly" 
              value="${user.email || ''}"
              readonly 
            />
          </div>
          
          <!-- 닉네임 -->
          <div class="profile-form-group">
            <label for="nickname" class="profile-label">닉네임</label>
            <input 
              type="text" 
              id="nickname" 
              name="nickname" 
              class="profile-input" 
              value="${user.nickname || ''}"
              placeholder="닉네임을 입력하세요"
              required 
            />
            <span class="profile-helper-text" id="nickname-error"></span>
          </div>
          
          <button type="submit" class="btn btn-primary profile-submit-btn">수정하기</button>
          
          <button type="button" id="withdraw-btn" class="profile-withdraw-btn">
            회원 탈퇴
          </button>
        </form>
      </div>
    </main>
  `;
  
  // 헤더 이벤트 초기화
  initHeaderEvents();
  
  // 이벤트 리스너 등록
  attachMyPageEvents();
}

/**
 * 마이페이지 이벤트 리스너 등록
 */
function attachMyPageEvents() {
  const form = document.getElementById('profile-form');
  const editPhotoBtn = document.getElementById('edit-photo-btn');
  const profileInput = document.getElementById('profile-image');
  const withdrawBtn = document.getElementById('withdraw-btn');
  
  // 프로필 수정 폼 제출
  form.addEventListener('submit', handleProfileUpdate);
  
  // 프로필 사진 편집 버튼 클릭
  editPhotoBtn.addEventListener('click', () => {
    profileInput.click();
  });
  
  // 프로필 사진 선택 시 미리보기
  profileInput.addEventListener('change', handlePhotoChange);
  
  // 회원 탈퇴 버튼 클릭
  withdrawBtn.addEventListener('click', handleWithdraw);
}

/**
 * 프로필 사진 변경 처리
 */
function handlePhotoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const avatarImg = document.getElementById('avatar-img');
    
    if (avatarImg.tagName === 'IMG') {
      avatarImg.src = event.target.result;
    } else {
      // IMG 태그로 교체
      const imgElement = document.createElement('img');
      imgElement.src = event.target.result;
      imgElement.className = 'profile-avatar-img';
      imgElement.id = 'avatar-img';
      avatarImg.replaceWith(imgElement);
    }
  };
  reader.readAsDataURL(file);
}

/**
 * 프로필 수정 처리
 */
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const nickname = formData.get('nickname');
  const profileImage = document.getElementById('profile-image').files[0];
  
  // 입력값 검증
  if (!nickname) {
    showError('nickname-error', '닉네임을 입력해주세요.');
    return;
  }
  
  const submitBtn = form.querySelector('.profile-submit-btn');
  const originalText = submitBtn.textContent;
  
  try {
    // 로딩 상태
    submitBtn.textContent = '수정 중...';
    submitBtn.disabled = true;
    
    // 수정 데이터 준비
    const updateData = { nickname };
    
    // 프로필 이미지가 변경되었으면 Base64로 변환
    if (profileImage) {
      const base64Image = await fileToBase64(profileImage);
      updateData.profileImage = base64Image;
    }
    
    // 프로필 수정 API 호출
    const result = await api.put('/users/me', updateData);
    
    // 로컬 상태 업데이트
    updateUser(result);
    
    alert('프로필이 수정되었습니다!');
    
    // 페이지 새로고침
    renderMyPage();
    
  } catch (error) {
    alert('프로필 수정에 실패했습니다: ' + error.message);
  } finally {
    // 버튼 상태 복원
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * 회원 탈퇴 처리
 */
async function handleWithdraw() {
  if (!confirm('정말로 회원 탈퇴하시겠습니까?\n탈퇴 후 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
    return;
  }
  
  if (!confirm('정말로 탈퇴하시겠습니까? (재확인)')) {
    return;
  }
  
  try {
    // 회원 탈퇴 API 호출
    await api.delete('/users/me');
    
    // 로그아웃 처리
    clearUser();
    
    alert('회원 탈퇴가 완료되었습니다.');
    navigateTo('/login');
    
  } catch (error) {
    alert('회원 탈퇴에 실패했습니다: ' + error.message);
  }
}

/**
 * 에러 메시지 표시
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = `* ${message}`;
    errorElement.classList.add('show');
  }
}

/**
 * 파일을 Base64로 변환
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
