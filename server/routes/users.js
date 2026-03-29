import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { users } from '../data/users.js';
import { getUserPosts, deletePost } from '../data/posts.js';

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
        createdAt: req.user.createdAt,
        followersCount: req.user.followers.length,
        followingCount: req.user.following.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID (с обновлёнными полями)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing: req.user.following.includes(userId)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName !== undefined) users[userIndex].firstName = firstName;
    if (lastName !== undefined) users[userIndex].lastName = lastName;
    if (bio !== undefined) users[userIndex].bio = bio;

    const updatedUser = {
      id: users[userIndex].id,
      username: users[userIndex].username,
      email: users[userIndex].email,
      firstName: users[userIndex].firstName,
      lastName: users[userIndex].lastName,
      avatar: users[userIndex].avatar || '',
      bio: users[userIndex].bio || '',
      createdAt: users[userIndex].createdAt,
      followersCount: users[userIndex].followers.length,
      followingCount: users[userIndex].following.length
    };

    req.user = updatedUser;
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Follow user
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user.id;

    if (userIdToFollow === currentUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = users.find(u => u.id === userIdToFollow);
    const currentUser = users.find(u => u.id === currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(currentUserId);

    res.json({
      message: 'User followed successfully',
      following: true,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unfollow user
router.post('/:id/unfollow', authenticateToken, async (req, res) => {
  try {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user.id;

    const userToUnfollow = users.find(u => u.id === userIdToUnfollow);
    const currentUser = users.find(u => u.id === currentUserId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    if (!currentUser.following.includes(userIdToUnfollow)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(id => id !== userIdToUnfollow);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== currentUserId);

    res.json({
      message: 'User unfollowed successfully',
      following: false,
      followersCount: userToUnfollow.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get followers list
router.get('/:id/followers', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followers = user.followers.map(followerId => {
      const follower = users.find(u => u.id === followerId);
      if (!follower) return null;
      return {
        id: follower.id,
        username: follower.username,
        firstName: follower.firstName,
        lastName: follower.lastName,
        avatar: follower.avatar,
        isFollowing: req.user.following.includes(follower.id)
      };
    }).filter(Boolean);

    res.json({ followers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get following list
router.get('/:id/following', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const following = user.following.map(followingId => {
      const followedUser = users.find(u => u.id === followingId);
      if (!followedUser) return null;
      return {
        id: followedUser.id,
        username: followedUser.username,
        firstName: followedUser.firstName,
        lastName: followedUser.lastName,
        avatar: followedUser.avatar,
        isFollowing: true
      };
    }).filter(Boolean);

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

    const results = users.filter(user =>
      user.username.toLowerCase().includes(q.toLowerCase()) ||
      user.firstName.toLowerCase().includes(q.toLowerCase()) ||
      user.lastName.toLowerCase().includes(q.toLowerCase())
    ).map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isFollowing: req.user.following.includes(user.id)
    }));

    res.json({ users: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:userId/posts
router.get('/:userId/posts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = getUserPosts(userId);
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/users/posts/:postId
router.delete('/posts/:postId', authenticateToken, async (req, res) => {
  try {
const { postId } = req.params;
    // Проверяем, что пост принадлежит текущему пользователю
    const post = findPostById(postId); 
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    const deleted = deletePost(postId);
    if (deleted) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;