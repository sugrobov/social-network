import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchPosts } from '../store/slices/postsSlice';
import { fetchStories } from '../store/slices/storiesSlice';
import CreatePost from './CreatePost';
import Post from './Post';
import StoriesFeed from './StoriesFeed';
//** страница ленты */
function Feed() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts());
      dispatch(fetchStories());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Сторисы */}
      <StoriesFeed />

      {/* Создание поста */}
      <CreatePost />

      {/* Лента постов */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка постов...</p>
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">Пока нет постов</p>
          <p className="text-gray-400 mt-2">
            Будьте первым, кто поделится чем-то интересным!
          </p>
        </div>
      )}
    </div>
  );
}

export default Feed;