import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar,
        bio: req.user.bio || '',
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Mock
    const user = {
      id: userId,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      avatar: '',
      bio: 'Hello! I am John Doe.',
      createdAt: new Date(),
      followers: 150,
      following: 89
    };

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    
    // Обновляем user
    req.user.firstName = firstName || req.user.firstName;
    req.user.lastName = lastName || req.user.lastName;
    req.user.bio = bio || req.user.bio;

    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Follow user
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    
    if (userIdToFollow === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    res.json({ 
      message: 'User followed successfully',
      following: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unfollow user
router.post('/:id/unfollow', authenticateToken, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.id;

    res.json({ 
      message: 'User unfollowed successfully',
      following: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's followers
router.get('/:id/followers', authenticateToken, async (req, res) => {
  try {
    const followers = [
      {
        id: '2',
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Smith',
        avatar: '',
        isFollowing: true
      },
      {
        id: '3', 
        username: 'bob',
        firstName: 'Bob',
        lastName: 'Johnson',
        avatar: '',
        isFollowing: false
      }
    ];

    res.json({ followers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's following
router.get('/:id/following', authenticateToken, async (req, res) => {
  try {
    const following = [
      {
        id: '4',
        username: 'charlie',
        firstName: 'Charlie',
        lastName: 'Brown',
        avatar: '',
        isFollowing: true
      }
    ];

    res.json({ following });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = [
      {
        id: '5',
        username: 'johnsmith',
        firstName: 'John',
        lastName: 'Smith',
        avatar: '',
        isFollowing: false
      },
      {
        id: '6',
        username: 'johnny',
        firstName: 'Johnny',
        lastName: 'Depp',
        avatar: '',
        isFollowing: true
      }
    ].filter(user => 
      user.username.toLowerCase().includes(q.toLowerCase()) ||
      user.firstName.toLowerCase().includes(q.toLowerCase()) ||
      user.lastName.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
