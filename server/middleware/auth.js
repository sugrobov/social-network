import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

//middleware for authentication
export const authenticateToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                message: 'Access denied.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = users.find(user => user.id === decoded.userId); // находим пользователя по id из токена

        if (!user) {
            res.status(401).json({
                message: 'User not found.'
            });
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            bio: user.bio || '',
            createdAt: user.createdAt
        };
        
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token.'
        });
    }
}