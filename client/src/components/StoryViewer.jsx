import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { viewStory } from '../store/slices/storiesSlice';

/** StoryViewer.jsx - компонент просмотра историй */
function StoryViewer({ isOpen, onClose, stories }) {

  const STORY_DURATION = 10000; // 10 секунд
  const PROGRESS_INTERVAL = 50;
  const PROGRESS_STEP = 100 / (STORY_DURATION / PROGRESS_INTERVAL);

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef();
  const dispatch = useDispatch();

  const currentStory = stories?.stories?.[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || !stories) return;

    setCurrentStoryIndex(0);
    setProgress(0);
    startProgress();
    markAsViewed();


    return () => {
      clearInterval(progressInterval.current);
    };
  }, [isOpen, stories]);

  useEffect(() => {
    if (currentStory) {
      setProgress(0);
      startProgress();
      markAsViewed();
    }
  }, [currentStoryIndex]);

  const startProgress = () => {
    clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + PROGRESS_STEP; // 10 секунд на сторис
        });
      }
    }, PROGRESS_INTERVAL);
  };

  const markAsViewed = async () => {
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
    if (currentStory && currentUserId && !currentStory.views.includes(currentStory.author.id)) {
      try {
        await dispatch(viewStory(currentStory.id)).unwrap();
      } catch (error) {
        console.error('Error marking story as viewed:', error);
      }
    }
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight') nextStory();
    if (e.key === 'ArrowLeft') prevStory();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
      clearInterval(progressInterval.current);
    };
  }, [isOpen, currentStoryIndex]);

  if (!isOpen || !stories) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Прогресс бары */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {stories.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentStoryIndex ? '100%' :
                  index === currentStoryIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Контент сторис */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className="w-full h-full flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundColor: currentStory.backgroundColor,
            backgroundImage: currentStory.mediaUrl ? `url(http://localhost:5000${currentStory.mediaUrl})` : 'none'
          }}
        >
          {currentStory.mediaUrl ? (
            <img
              src={`http://localhost:5000${currentStory.mediaUrl}`}
              alt="Story media"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div
              className="text-2xl font-bold text-center p-8 max-w-lg"
              style={{ color: currentStory.textColor }}
            >
              {currentStory.content}
            </div>
          )}
        </div>

        {/* Информация об авторе */}
        <div className="absolute top-6 left-6 flex items-center space-x-3 text-white z-10">
          <img
            src={stories?.author?.avatar || '/default-avatar.png'}
            alt={stories.author.username}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="font-semibold">
              {stories.author.firstName} {stories.author.lastName}
            </p>
            <p className="text-sm opacity-90">
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Кнопки навигации */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity"
        >
          ‹
        </button>
        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100 transition-opacity"
        >
          ›
        </button>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-2xl opacity-70 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

StoryViewer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  stories: PropTypes.shape({
    author: PropTypes.object,
    stories: PropTypes.array
  })
};

export default StoryViewer;