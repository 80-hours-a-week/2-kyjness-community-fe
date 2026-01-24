/**
 * 게시글 상세 페이지
 */

import { api } from '../api.js';
import { getUser } from '../state.js';
import { navigateTo } from '../router.js';
import { renderHeader, initHeaderEvents } from '../components/header.js';
import { renderCommentList } from '../components/commentlist.js';

/**
 * 게시글 상세 페이지 렌더링
 * @param {Object} params - 라우트 파라미터 { id: '123' }
 */
export async function renderPostDetailPage(params) {
  const root = document.getElementById('app-root');
  const postId = params.id;
  
  if (!postId) {
    alert('잘못된 게시글 ID입니다.');
    navigateTo('/posts');
    return;
  }
  
  root.innerHTML = `
    ${renderHeader()}
    
    <main class="post-detail-container">
      <div class="loading">
        <div class="spinner"></div>
      </div>
    </main>
  `;
  
  // 헤더 이벤트 초기화
  initHeaderEvents();
  
  // 게시글 상세 정보 로드
  await loadPostDetail(postId);
}

/**
 * 게시글 상세 정보 로드
 */
async function loadPostDetail(postId) {
  const container = document.querySelector('.post-detail-container');
  const currentUser = getUser();
  
  try {
    // 게시글 상세 API 호출
    const post = await api.get(`/posts/${postId}`);
    
    const isAuthor = currentUser && currentUser.id === post.author?.id;
    
    container.innerHTML = `
      <!-- 게시글 헤더 -->
      <div class="post-detail-header">
        <h1 class="post-detail-title">${post.title || '제목 없음'}</h1>
        <div class="post-detail-meta">
          <div class="post-detail-author">
            ${post.author?.profileImageUrl 
              ? `<img src="${post.author.profileImageUrl}" alt="${post.author.nickname}" class="post-detail-avatar" />`
              : `<div class="post-detail-avatar"></div>`
            }
            <span>${post.author?.nickname || '알 수 없음'}</span>
          </div>
          <span>${formatDate(post.createdAt)}</span>
          <span>조회수 ${post.hits || 0}</span>
        </div>
      </div>
      
      <!-- 게시글 본문 -->
      <div class="post-detail-content">${post.content || ''}</div>
      
      <!-- 게시글 액션 (좋아요, 수정, 삭제) -->
      <div class="post-detail-actions">
        <button id="like-btn" class="post-like-btn ${post.isLiked ? 'liked' : ''}">
          ❤️ 좋아요 ${post.likeCount || 0}
        </button>
        
        ${isAuthor ? `
          <div class="post-action-group">
            <button id="edit-btn" class="post-edit-btn">수정</button>
            <button id="delete-btn" class="post-delete-btn">삭제</button>
          </div>
        ` : ''}
      </div>
      
      <!-- 댓글 섹션 -->
      <div class="comments-section">
        <h3 class="comments-title">댓글 ${post.commentCount || 0}개</h3>
        
        <!-- 댓글 작성 폼 -->
        <form id="comment-form" class="comment-form">
          <textarea 
            id="comment-content" 
            class="comment-textarea" 
            placeholder="댓글을 입력하세요..."
            required
          ></textarea>
          <button type="submit" class="comment-submit-btn">댓글 작성</button>
        </form>
        
        <!-- 댓글 목록 -->
        <div id="comments-list" class="comments-list">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    `;
    
    // 댓글 목록 로드
    await loadComments(postId);
    
    // 이벤트 리스너 등록
    attachPostDetailEvents(postId, post);
    
  } catch (error) {
    console.error('게시글 로드 실패:', error);
    container.innerHTML = `
      <p style="text-align: center; color: #ff0000; padding: 40px;">
        게시글을 불러오는 중 오류가 발생했습니다.
      </p>
      <button 
        onclick="window.location.hash='/posts'" 
        style="display: block; margin: 0 auto; padding: 12px 24px; background-color: #aca0eb; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        목록으로 돌아가기
      </button>
    `;
  }
}

/**
 * 댓글 목록 로드
 */
async function loadComments(postId) {
  const commentsList = document.getElementById('comments-list');
  
  try {
    // 댓글 목록 API 호출
    const response = await api.get(`/posts/${postId}/comments`);
    const comments = response.data || [];
    
    if (comments.length === 0) {
      commentsList.innerHTML = `
        <p style="text-align: center; color: #666; padding: 20px;">
          첫 번째 댓글을 작성해보세요!
        </p>
      `;
      return;
    }
    
    // 댓글 목록 렌더링
    commentsList.innerHTML = renderCommentList(comments);
    
  } catch (error) {
    console.error('댓글 로드 실패:', error);
    commentsList.innerHTML = `
      <p style="text-align: center; color: #ff0000; padding: 20px;">
        댓글을 불러오는 중 오류가 발생했습니다.
      </p>
    `;
  }
}

/**
 * 게시글 상세 페이지 이벤트 리스너 등록
 */
function attachPostDetailEvents(postId, post) {
  const likeBtn = document.getElementById('like-btn');
  const editBtn = document.getElementById('edit-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const commentForm = document.getElementById('comment-form');
  
  // 좋아요 버튼 클릭
  if (likeBtn) {
    likeBtn.addEventListener('click', () => handleLike(postId));
  }
  
  // 수정 버튼 클릭
  if (editBtn) {
    editBtn.addEventListener('click', () => handleEdit(postId, post));
  }
  
  // 삭제 버튼 클릭
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => handleDelete(postId));
  }
  
  // 댓글 작성 폼 제출
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => handleCommentSubmit(e, postId));
  }
}

/**
 * 좋아요 처리
 */
async function handleLike(postId) {
  const likeBtn = document.getElementById('like-btn');
  const isLiked = likeBtn.classList.contains('liked');
  
  try {
    if (isLiked) {
      // 좋아요 취소
      await api.delete(`/posts/${postId}/likes`);
      likeBtn.classList.remove('liked');
    } else {
      // 좋아요 추가
      await api.post(`/posts/${postId}/likes`);
      likeBtn.classList.add('liked');
    }
    
    // 좋아요 수 업데이트
    const post = await api.get(`/posts/${postId}`);
    likeBtn.textContent = `❤️ 좋아요 ${post.likeCount || 0}`;
    
  } catch (error) {
    alert('좋아요 처리에 실패했습니다: ' + error.message);
  }
}

/**
 * 게시글 수정
 */
function handleEdit(postId, post) {
  const newTitle = prompt('새 제목을 입력하세요:', post.title);
  if (!newTitle) return;
  
  const newContent = prompt('새 내용을 입력하세요:', post.content);
  if (!newContent) return;
  
  updatePost(postId, newTitle, newContent);
}

/**
 * 게시글 수정 API 호출
 */
async function updatePost(postId, title, content) {
  try {
    await api.put(`/posts/${postId}`, { title, content });
    alert('게시글이 수정되었습니다!');
    
    // 페이지 새로고침
    renderPostDetailPage({ id: postId });
    
  } catch (error) {
    alert('게시글 수정에 실패했습니다: ' + error.message);
  }
}

/**
 * 게시글 삭제
 */
async function handleDelete(postId) {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    await api.delete(`/posts/${postId}`);
    alert('게시글이 삭제되었습니다.');
    navigateTo('/posts');
    
  } catch (error) {
    alert('게시글 삭제에 실패했습니다: ' + error.message);
  }
}

/**
 * 댓글 작성 처리
 */
async function handleCommentSubmit(e, postId) {
  e.preventDefault();
  
  const contentInput = document.getElementById('comment-content');
  const content = contentInput.value.trim();
  
  if (!content) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  
  try {
    await api.post(`/posts/${postId}/comments`, { content });
    
    // 댓글 입력창 초기화
    contentInput.value = '';
    
    // 댓글 목록 새로고침
    await loadComments(postId);
    
    // 댓글 수 업데이트
    const commentsTitle = document.querySelector('.comments-title');
    const post = await api.get(`/posts/${postId}`);
    commentsTitle.textContent = `댓글 ${post.commentCount || 0}개`;
    
  } catch (error) {
    alert('댓글 작성에 실패했습니다: ' + error.message);
  }
}

/**
 * 날짜 포맷팅
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
  // 그 외
  return date.toLocaleDateString('ko-KR');
}
