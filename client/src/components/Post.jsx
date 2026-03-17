import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, addComment } from '../store/slices/postsSlice';
import Avatar from './UI/Avatar';

function Post({ post, onDelete, showDelete = false }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Защита от отсутствующего post или author
  if (!post) {
    return null;
  }

  // Безопасные значения по умолчанию
  const safePost = {
    id: post.id || 0,
    content: post.content || '',
    image: post.image || null,
    createdAt: post.createdAt || new Date().toISOString(),
    likes: post.likes || [],
    comments: post.comments || [],
    author: post.author || {
      id: 0,
      firstName: 'Пользователь',
      lastName: '',
      username: 'user',
      avatar: '/default-avatar.png'
    }
  };

  const isLiked = safePost.likes.includes(user?.id);

  const handleLike = async () => {
    try {
      await dispatch(likePost(safePost.id)).unwrap();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      await dispatch(addComment({
        postId: safePost.id,
        content: newComment
      })).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ru-RU');
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 w-full overflow-hidden relative">
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(post.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
          aria-label="Удалить пост"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      
      {/* Заголовок поста */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <Avatar user={safePost.author} size="sm" className="flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {safePost.author.firstName} {safePost.author.lastName}
            </h3>
            <p className="text-sm text-gray-500 truncate">@{safePost.author.username}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {formatDate(safePost.createdAt)}
        </span>
      </div>

      {/* Контент поста */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap break-words">{safePost.content}</p>
        {safePost.image && (
          <img
            src={`http://localhost:5000${safePost.image}`}
            alt="Post media"
            className="mt-3 rounded-lg w-full h-auto max-h-96 object-contain"
          />
        )}
      </div>

      {/* Статистика */}
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="mr-4">{safePost.likes.length} лайков</span>
        <span>{safePost.comments.length} комментариев</span>
      </div>

      {/* Действия */}
      <div className="flex border-t border-b border-gray-200 py-2">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="text-lg mr-2">❤️</span>
          {isLiked ? 'Не нравится' : 'Нравится'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
        >
          <span className="text-lg mr-2">💬</span>
          Комментировать
        </button>
      </div>

      {/* Комментарии */}
      {showComments && (
        <div className="mt-4">
          {/* Список комментариев */}
          {safePost.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {safePost.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar user={comment.author} size="sm" />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <p className="font-semibold text-sm">
                        {comment.author?.firstName} {comment.author?.lastName}
                      </p>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Форма комментария */}
          <form onSubmit={handleAddComment} className="flex space-x-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmittingComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isSubmittingComment ? '...' : 'Отправить'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;