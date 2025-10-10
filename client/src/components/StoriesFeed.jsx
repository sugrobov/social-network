
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchStories } from '../store/slices/storiesSlice';

// Константы
const REFRESH_INTERVAL = 30000; // 30 секунд
const DEFAULT_AVATAR = '/default-avatar.png';
const API_BASE_URL = 'http://localhost:5000';

function StoriesFeed({ onStoryOpen }) {
     const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();
  
  const { items: stories, loading, error } = useSelector(state => state.stories);
  const currentUser = useSelector(state => state.user.currentUser);
  
  const refreshIntervalRef = useRef();

  useEffect(() => {
    // Первоначальная загрузка
    loadStories();
    
    // Автообновление сторис
    refreshIntervalRef.current = setInterval(loadStories, REFRESH_INTERVAL);
    
    return () => {
      clearInterval(refreshIntervalRef.current);
    };
  }, []);

  const loadStories = () => {
    setLocalLoading(true);
    dispatch(fetchStories())
      .finally(() => setLocalLoading(false));
  };

  const handleStoryClick = (storyGroup) => {
    if (storyGroup.stories?.length > 0 && onStoryOpen) {
      onStoryOpen(storyGroup);
    }
  };

  const handleRetry = () => {
    loadStories();
  };

  const isAnyLoading = localLoading || loading;
  const hasStories = stories && stories.length > 0;

  // Состояния загрузки
  if (isAnyLoading && !hasStories) {
    return (
      <div className="stories-feed loading">
        <div>Loading stories...</div>
      </div>
    );
  }

  if (error && !hasStories) {
    return (
      <div className="stories-feed error">
        <div>Error: {error}</div>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="stories-feed">
      <h2>Stories</h2>
      
      {!hasStories ? (
        <div className="empty-state">
          No stories available
        </div>
      ) : (
        <div className="stories-list">
          {stories.map(storyGroup => (
            <div 
              key={storyGroup.author.id} 
              className="story-group"
              onClick={() => handleStoryClick(storyGroup)}
            >
              <div className="story-author">
                <img 
                  src={storyGroup.author?.avatar || DEFAULT_AVATAR} 
                  alt={storyGroup.author?.username || 'User'}
                  className={`avatar ${hasUnviewedStories(storyGroup) ? 'unviewed' : 'viewed'}`}
                />
                <span>{storyGroup.author?.username || 'Unknown'}</span>
              </div>
              
              <div className="story-preview">
                {storyGroup.stories?.slice(0, 1).map(story => (
                  <div key={story.id} className="story-item">
                    {story.mediaUrl ? (
                      <img 
                        src={`${API_BASE_URL}${story.mediaUrl}`} 
                        alt="Story preview" 
                      />
                    ) : (
                      <div 
                        className="text-story"
                        style={{
                          backgroundColor: story.backgroundColor,
                          color: story.textColor
                        }}
                      >
                        {story.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && hasStories && (
        <div className="error-banner">
          Failed to update stories: {error}
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
      
      {isAnyLoading && hasStories && (
        <div className="loading-banner">Updating stories...</div>
      )}
    </div>
  );
}

// Вспомогательная функция для определения непросмотренных сторис
const hasUnviewedStories = (storyGroup) => {
  if (!storyGroup.stories || !storyGroup.stories.length) return false;
  
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
  if (!currentUserId) return true;
  
  return storyGroup.stories.some(story => 
    !story.views?.includes(currentUserId)
  );
};

// PropTypes
StoriesFeed.propTypes = {
  onStoryOpen: PropTypes.func
};

export default StoriesFeed;