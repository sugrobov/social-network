import React, { useState, useSelector } from 'react';
import { likePost } from '../store/slices/postsSlice';
import { authService } from '../services/authService';

function Post({ post }) {
    const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isLiked = post.likes.includes(user?.id);
  const isAuthor = post.author.id === user?.id;

  const handleLike = async () => {
    try {
      await dispatch(likePost(post.id)).unwrap();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // тут нужно добавить комментарий к посту
    console.log('Adding comment:', newComment);
    setNewComment('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Заголовок поста */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || '/default-avatar.png'}
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.author.firstName} {post.author.lastName}
            </h3>
            <p className="text-sm text-gray-500">@{post.author.username}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Контент поста */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post media"
            className="mt-3 rounded-lg max-w-full h-auto"
          />
        )}
      </div>

      {/* Статистика */}
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="mr-4">{post.likes.length} лайков</span>
        <span>{post.comments.length} комментариев</span>
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
          {post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.author?.avatar || '/default-avatar.png'}
                    alt={comment.author?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
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
              disabled={!newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
            >
              Отправить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;