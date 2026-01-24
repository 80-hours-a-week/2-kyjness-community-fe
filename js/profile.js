/**
 * 회원정보수정 페이지 초기화
 */

// 사용자 메뉴 드롭다운 토글
function initUserMenu() {
  const menuBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');

  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }
}

// 프로필 사진 편집 버튼
function initProfileEdit() {
  const editBtn = document.getElementById('profile-edit-btn');
  const avatarImg = document.getElementById('profile-avatar-img');

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // TODO: 파일 선택 다이얼로그 열기
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (avatarImg) {
              avatarImg.src = event.target.result;
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }
}

// 폼 제출 처리
function initProfileForm() {
  const form = document.getElementById('profile-form');
  const nicknameInput = document.getElementById('nickname');
  const nicknameError = document.getElementById('nickname-error');
  const submitBtn = form?.querySelector('.profile-submit-btn');
  const completeBtn = document.getElementById('complete-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nickname = nicknameInput?.value.trim();

      // 닉네임 유효성 검사
      if (!nickname) {
        nicknameError?.classList.add('show');
        return;
      } else {
        nicknameError?.classList.remove('show');
      }

      // TODO: API 호출하여 회원정보 수정
      console.log('회원정보 수정:', {
        nickname: nickname
      });

      // 수정하기 버튼 숨기고 수정완료 버튼 표시
      if (submitBtn) submitBtn.style.display = 'none';
      if (completeBtn) completeBtn.style.display = 'block';
    });
  }

  // 수정완료 버튼 클릭
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      // TODO: 페이지 새로고침 또는 다른 페이지로 이동
      window.location.reload();
    });
  }
}

// 회원 탈퇴 버튼
function initWithdraw() {
  const withdrawBtn = document.getElementById('withdraw-btn');

  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', () => {
      if (confirm('정말 회원 탈퇴를 하시겠습니까?')) {
        // TODO: 회원 탈퇴 API 호출
        console.log('회원 탈퇴');
      }
    });
  }
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
  initUserMenu();
  initProfileEdit();
  initProfileForm();
  initWithdraw();
});
