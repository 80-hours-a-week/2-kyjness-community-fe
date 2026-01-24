/**
 * 게시글 목록 페이지
 */

import { api } from '../api.js';
import { getUser } from '../state.js';
import { navigateTo } from '../router.js';
import { renderHeader, initHeaderEvents } from '../components/header.js';
import { renderPostCard } from '../components/postCard.js';

/**
 * 게시글 목록 페이지 렌더링
 */
export async function renderPostListPage() {
  const root = document.getElementById('app-root');
  const user = getUser();
  
  root.innerHTML = `
    ${renderHeader()}
    
    <main class="posts-main main">
      <div class="posts-container">
        <!-- 인사말 섹션 -->
        <div class="posts-greeting">
          <div class="posts-greeting-text">
            <p>안녕하세요, <strong>${user?.nickname || '사용자'}</strong>님!</p>
            <p>오늘도 즐거운 하루 보내세요 🎉</p>
          </div>
          <button id="write-post-btn" class="btn btn-primary posts-write-btn">
            게시글 작성
          </button>
        </div>
        
        <!-- 게시글 목록 -->
        <div id="posts-list" class="posts-list">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </main>
  `;
  
  // 헤더 이벤트 초기화
  initHeaderEvents();
  
  // 게시글 목록 로드
  await loadPosts();
  
  // 이벤트 리스너 등록
  attachPostListEvents();
}

/**
 * 게시글 목록 로드
 */
async function loadPosts() {
  const postsList = document.getElementById('posts-list');
  
  try {
    // 게시글 목록 API 호출
    const response = await api.get('/posts?page=1&size=20');
    const posts = response.data || [];
    
    if (posts.length === 0) {
      postsList.innerHTML = `
        <p style="text-align: center; color: #666; padding: 40px;">
          게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
        </p>
      `;
      return;
    }
    
    // 게시글 카드 렌더링
    postsList.innerHTML = posts.map(post => renderPostCard(post)).join('');
    
    // 게시글 카드 클릭 이벤트 등록
    postsList.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        const postId = card.dataset.postId;
        navigateTo(`/posts/${postId}`);
      });
    });
    
  } catch (error) {
    console.error('게시글 목록 로드 실패:', error);
    postsList.innerHTML = `
      <p style="text-align: center; color: #ff0000; padding: 40px;">
        게시글을 불러오는 중 오류가 발생했습니다.
      </p>
    `;
  }
}

/**
 * 게시글 목록 페이지 이벤트 리스너 등록
 */
function attachPostListEvents() {
  const writeBtn = document.getElementById('write-post-btn');
  
  // 게시글 작성 버튼 클릭
  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      // TODO: 게시글 작성 페이지로 이동 (추후 구현)
      const title = prompt('게시글 제목을 입력하세요:');
      if (!title) return;
      
      const content = prompt('게시글 내용을 입력하세요:');
      if (!content) return;
      
      createPost(title, content);
    });
  }
}

/**
 * 게시글 작성
 */
async function createPost(title, content) {
  try {
    await api.post('/posts', { title, content });
    alert('게시글이 작성되었습니다!');
    
    // 페이지 새로고침 (게시글 목록 다시 로드)
    renderPostListPage();
    
  } catch (error) {
    alert('게시글 작성에 실패했습니다: ' + error.message);
  }
}
