import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar  || '',
      bio: user.bio || '',
      followers: user.followers || [],
      following: user.following || [],
      createdAt: user.createdAt
    };

    next();
  } catch (error) {
     // Детальная обработка разных типов ошибок JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.',
        code: 'INVALID_TOKEN' 
      });
    }
    
    // Любая другая ошибка
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Authentication failed.',
      code: 'AUTH_FAILED'
    });
  
  }
};