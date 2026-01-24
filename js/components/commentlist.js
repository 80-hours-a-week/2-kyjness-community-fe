/**
 * 댓글 목록 컴포넌트
 */

import { getUser } from '../state.js';

/**
 * 댓글 목록 렌더링
 * @param {Array} comments - 댓글 배열
 * @returns {string} 댓글 목록 HTML
 */
export function renderCommentList(comments) {
  if (!comments || comments.length === 0) {
    return `
      <p style="text-align: center; color: #666; padding: 20px;">
        첫 번째 댓글을 작성해보세요!
      </p>
    `;
  }
  
  return comments.map(comment => renderCommentItem(comment)).join('');
}

/**
 * 댓글 아이템 렌더링
 * @param {Object} comment - 댓글 데이터
 * @returns {string} 댓글 아이템 HTML
 */
function renderCommentItem(comment) {
  const currentUser = getUser();
  const isAuthor = currentUser && currentUser.id === comment.author?.id;
  
  const authorName = comment.author?.nickname || '알 수 없음';
  const authorAvatar = comment.author?.profileImageUrl || '';
  
  return `
    <div class="comment-item" data-comment-id="${comment.commentId}">
      <div class="comment-header">
        ${authorAvatar 
          ? `<img src="${authorAvatar}" alt="${escapeHtml(authorName)}" class="comment-avatar" />`
          : `<div class="comment-avatar"></div>`
        }
        <span class="comment-author">${escapeHtml(authorName)}</span>
        <span class="comment-date">${formatDate(comment.createdAt)}</span>
      </div>
      
      <p class="comment-content">${escapeHtml(comment.content)}</p>
      
      ${isAuthor ? `
        <div class="comment-actions">
          <button class="comment-action-btn" data-action="edit" data-comment-id="${comment.commentId}">
            수정
          </button>
          <button class="comment-action-btn" data-action="delete" data-comment-id="${comment.commentId}">
            삭제
          </button>
        </div>
      ` : ''}
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
  
  // 그 외
  return date.toLocaleDateString('ko-KR');
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
