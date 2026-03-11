import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../store/slices/storiesSlice';

function StoriesFeed({ onStoryOpen }) {
  const dispatch = useDispatch();
  const { items: stories, loading, error } = useSelector(state => state.stories);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const hasUnviewed = (storyGroup) => {
    if (!storyGroup.stories?.length) return false;
    return storyGroup.stories.some(story => !story.views?.includes(user?.id));
  };

  if (loading && !stories.length) {
    return <div className="flex justify-center p-4">Загрузка историй...</div>;
  }

  if (error && !stories.length) {
    return (
      <div className="text-center p-4 text-red-500">
        Ошибка загрузки: {error}
        <button onClick={() => dispatch(fetchStories())} className="ml-2 text-blue-500">Повторить</button>
      </div>
    );
  }

  if (!stories.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 overflow-x-auto">
      <div className="flex space-x-4">
        {stories.map((group) => (
          <div
            key={group.author.id}
            className="flex-shrink-0 cursor-pointer text-center"
            onClick={() => onStoryOpen?.(group)}
          >
            <div className="relative">
              <img
                src={group.author.avatar || '/default-avatar.png'}
                alt={group.author.username}
                className={`w-16 h-16 rounded-full border-2 ${
                  hasUnviewed(group) ? 'border-blue-500' : 'border-gray-300'
                } object-cover`}
              />
            </div>
            <p className="text-sm mt-1 max-w-[80px] truncate">
              {group.author.firstName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesFeed;