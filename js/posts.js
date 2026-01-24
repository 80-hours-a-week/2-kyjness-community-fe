import { api } from './api.js';

/**
 * 게시글 목록을 API에서 가져옵니다
 */
async function fetchPosts() {
  try {
    const response = await api.get('/posts?page=1&size=10');
    return response.data || [];
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 오류 발생:', error);
    return [];
  }
}

/**
 * 날짜 포맷팅 (YYYY-MM-DD HH:mm:ss 형식)
 */
function formatDate(dateString) {
  if (!dateString) return '';
  return dateString;
}

/**
 * 게시글 카드 HTML을 생성합니다
 */
function createPostCard(post) {
  const { postId, title, likeCount, commentCount, hits, createdAt, author } = post;
  
  const authorName = author?.nickname || '알 수 없음';
  const authorAvatar = author?.profileImageUrl || '';
  
  return `
    <div class="post-card" data-post-id="${postId}">
      <h3 class="post-title">${title || '제목 없음'}</h3>
      <div class="post-meta">
        <span class="post-meta-item">좋아요 ${likeCount || 0}</span>
        <span class="post-meta-item">댓글 ${commentCount || 0}</span>
        <span class="post-meta-item">조회수 ${hits || 0}</span>
        <span class="post-timestamp">${formatDate(createdAt)}</span>
      </div>
      <div class="post-author">
        ${authorAvatar 
          ? `<img src="${authorAvatar}" alt="${authorName}" class="post-author-avatar" />`
          : `<div class="post-author-avatar"></div>`
        }
        <span class="post-author-name">${authorName}</span>
      </div>
    </div>
  `;
}

/**
 * 게시글 목록을 렌더링합니다
 */
async function renderPosts() {
  const postsList = document.getElementById('posts-list');
  if (!postsList) return;

  const posts = await fetchPosts();
  
  if (posts.length === 0) {
    postsList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">게시글이 없습니다.</p>';
    return;
  }

  postsList.innerHTML = posts.map(post => createPostCard(post)).join('');

  // 게시글 카드 클릭 이벤트 추가
  postsList.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.dataset.postId;
      // TODO: 게시글 상세 페이지로 이동
      console.log('게시글 상세 페이지로 이동:', postId);
    });
  });
}

/**
 * 게시글 작성 버튼 클릭 이벤트
 */
function initWriteButton() {
  const writeBtn = document.getElementById('write-post-btn');
  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      // TODO: 게시글 작성 페이지로 이동
      console.log('게시글 작성 페이지로 이동');
    });
  }
}

/**
 * 페이지 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
  initWriteButton();
});
