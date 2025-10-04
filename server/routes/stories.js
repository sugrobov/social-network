import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock stories data
let stories = [];

// Create story
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, mediaType = 'text', backgroundColor = '#3498db', textColor = '#ffffff' } = req.body;

    // Сторис живет 24 часа
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = {
      id: Date.now().toString(),
      author: {
        id: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar
      },
      content,
      mediaUrl: '',
      mediaType,
      backgroundColor,
      textColor,
      views: [],
      expiresAt,
      createdAt: new Date()
    };

    stories.push(story);

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
});

// Get feed stories
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    
    // Фильтруем активные сторис
    const activeStories = stories.filter(story => story.expiresAt > now);

    // Группируем по авторам
    const groupedStories = activeStories.reduce((acc, story) => {
      const authorId = story.author.id;
      if (!acc[authorId]) {
        acc[authorId] = {
          author: story.author,
          stories: []
        };
      }
      acc[authorId].stories.push(story);
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
});

// Get user stories
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const userStories = stories.filter(story => 
      story.author.id === userId && story.expiresAt > now
    );

    res.json(userStories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stories', error: error.message });
  }
});

// View story
router.post('/:storyId/view', authenticateToken, async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = stories.find(s => s.id === storyId);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Проверяем, не просматривал ли уже пользователь
    if (!story.views.includes(req.user.id)) {
      story.views.push(req.user.id);
    }

    res.json({ 
      message: 'Story viewed', 
      views: story.views.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error viewing story', error: error.message });
  }
});

// Delete story
router.delete('/:storyId', authenticateToken, async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const storyIndex = stories.findIndex(s => s.id === storyId);
    
    if (storyIndex === -1) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const story = stories[storyIndex];
    if (story.author.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    stories.splice(storyIndex, 1);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error: error.message });
  }
});

export default router;