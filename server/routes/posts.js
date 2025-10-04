import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock posts data
let posts = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
    content: 'This is my first post! Hello world!',
    image: '',
    likes: ['2', '3'],
    comments: [
      {
        id: '1',
        author: {
          id: '2',
          username: 'alice',
          firstName: 'Alice',
          lastName: 'Smith',
          avatar: ''
        },
        content: 'Great post!',
        createdAt: new Date()
      }
    ],
    createdAt: new Date()
  }
];

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, image } = req.body;

    const post = {
      id: Date.now().toString(),
      author: {
        id: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar
      },
      content,
      image: image || '',
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    posts.unshift(post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all posts
router.get('/', authenticateToken, async (req, res) => {
  try {
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    res.json({
      post,
      liked: likeIndex === -1,
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    
    const post = posts.find(p => p.id === postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      id: Date.now().toString(),
      author: {
        id: req.user.id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        avatar: req.user.avatar
      },
      content,
      createdAt: new Date()
    };

    post.comments.push(comment);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[postIndex];
    if (post.author.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    posts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;