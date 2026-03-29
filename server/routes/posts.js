import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllPosts, addPost, updatePost, findPostById, deletePost } from '../data/posts.js';

const router = express.Router();

// GET /api/posts - Лента (только посты подписок + свои)
router.get('/', authenticateToken, (req, res) => {
  try {
    const currentUserId = req.user.id;
    const followingIds = req.user.following; // массив ID пользователей, на кого подписан

    let allPosts = getAllPosts();

    // Фильтруем: автор — текущий пользователь ИЛИ автор в following
    const feedPosts = allPosts.filter(post => 
      post.author.id === currentUserId || followingIds.includes(post.author.id)
    );

    // Сортируем по дате (новые сверху)
    feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(feedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/posts - Создать пост
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, image } = req.body;

    const newPost = {
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
      createdAt: new Date().toISOString()
    };

    addPost(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/posts/:id/like - Лайк/дизлайк
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
    const post = findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    updatePost(post);
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/posts/:id/comments - Добавить комментарий
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const post = findPostById(postId);
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
      createdAt: new Date().toISOString()
    };

    post.comments.push(comment);
    updatePost(post);
    res.status(201).json({ postId, comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/posts/:id - Удалить пост (свои)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const postId = req.params.id;
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;