/**
 * 게시글 카드 컴포넌트
 */

/**
 * 게시글 카드 렌더링
 * @param {Object} post - 게시글 데이터
 * @returns {string} 게시글 카드 HTML
 */
export function renderPostCard(post) {
  const { postId, title, likeCount, commentCount, hits, createdAt, author } = post;
  
  const authorName = author?.nickname || '알 수 없음';
  const authorAvatar = author?.profileImageUrl || '';
  
  return `
    <div class="post-card" data-post-id="${postId}">
      <h3 class="post-title">${escapeHtml(title) || '제목 없음'}</h3>
      
      <div class="post-meta">
        <span class="post-meta-item">❤️ ${likeCount || 0}</span>
        <span class="post-meta-item">💬 ${commentCount || 0}</span>
        <span class="post-meta-item">👁 ${hits || 0}</span>
        <span class="post-timestamp">${formatDate(createdAt)}</span>
      </div>
      
      <div class="post-author">
        ${authorAvatar 
          ? `<img src="${authorAvatar}" alt="${escapeHtml(authorName)}" class="post-author-avatar" />`
          : `<div class="post-author-avatar"></div>`
        }
        <span class="post-author-name">${escapeHtml(authorName)}</span>
      </div>
    </div>
  `;
}

/**
 * 날짜 포맷팅
 * @param {string} dateString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜
 */
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // 1분 미만
  if (diff < 60000) {
    return '방금 전';
  }
  // 1시간 미만
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}분 전`;
  }
  // 24시간 미만
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}시간 전`;
  }
  // 7일 미만
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}일 전`;
  }
  
  // 그 외 - YYYY.MM.DD 형식
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * HTML 이스케이프 처리 (XSS 방지)
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
