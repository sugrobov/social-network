import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../store/slices/postsSlice';
import { fetchStories } from '../../store/slices/storiesSlice';
import CreatePost from '../../components/CreatePost';
import Post from '../../components/Post';
import StoriesFeed from '../../components/StoriesFeed';
import ErrorBoundary from '../../components/ErrorBoundary';

function Feed() {
  const dispatch = useDispatch();
  const { items: posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchStories());
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto">
      <StoriesFeed />
      <CreatePost />
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка постов...</p>
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <ErrorBoundary key={post.id}>
              <Post post={post} />
            </ErrorBoundary>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">Пока нет постов</p>
          <p className="text-gray-400 mt-2">Будьте первым, кто поделится чем-то интересным!</p>
        </div>
      )}
    </div>
  );
}

export default Feed;