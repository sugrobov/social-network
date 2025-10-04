import jwt from 'jsonwebtoken';

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
        // Mock 
        req.user = {
            id: decoded.userId,
            username: 'johndoe',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            avatar: '',
            bio: ''
        };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token.'
        });
    }
}