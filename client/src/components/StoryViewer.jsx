import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewStory } from '../store/slices/storiesSlice';
import Avatar from '../components/UI/Avatar';

const STORY_DURATION = 10000; // 10 сек
const PROGRESS_INTERVAL = 50;
const STEP = 100 / (STORY_DURATION / PROGRESS_INTERVAL);

function StoryViewer({ isOpen, onClose, stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const currentStory = stories?.stories?.[currentIndex];

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(0);
    setProgress(0);
    startProgress();
    markAsViewed(0);
    return () => clearInterval(intervalRef.current);
  }, [isOpen, stories]);

  useEffect(() => {
    if (!isOpen || !currentStory) return;
    setProgress(0);
    startProgress();
    markAsViewed(currentIndex);
  }, [currentIndex]);

  const startProgress = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!paused) {
        setProgress(prev => {
          if (prev >= 100) {
            goToNext();
            return 0;
          }
          return prev + STEP;
        });
      }
    }, PROGRESS_INTERVAL);
  };

  const markAsViewed = (index) => {
    const story = stories?.stories?.[index];
    if (story && user && !story.views?.includes(user.id)) {
      dispatch(viewStory(story.id));
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  if (!isOpen || !stories) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Прогресс-бары */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1">
        {stories.stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Контент */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {currentStory.mediaUrl ? (
          <img
            src={`http://localhost:5000${currentStory.mediaUrl}`}
            alt="story"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div
            className="text-2xl font-bold text-center p-8 max-w-lg"
            style={{ backgroundColor: currentStory.backgroundColor, color: currentStory.textColor }}
          >
            {currentStory.content}
          </div>
        )}

        {/* Информация об авторе */}
        <div className="absolute top-6 left-6 flex items-center space-x-3 text-white">
          <Avatar user={stories.author} size="md" />
          <div>
            <p className="font-semibold">{stories.author.firstName} {stories.author.lastName}</p>
            <p className="text-sm opacity-90">{new Date(currentStory.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Кнопки навигации */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100"
        >
          ‹
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl opacity-70 hover:opacity-100"
        >
          ›
        </button>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-2xl opacity-70 hover:opacity-100"
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