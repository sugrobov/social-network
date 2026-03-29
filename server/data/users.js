import bcrypt from 'bcryptjs';

export const users = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@test.com',
    password: bcrypt.hashSync('123456', 12),
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    bio: 'Test user bio',
    createdAt: new Date('2024-01-01'),
    followers: [],   // массив id пользователей, которые подписаны
    following: [],   // массив id пользователей, на которых подписан
  },
  {
    id: '2',
    username: 'johndoe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 12),
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
    bio: 'Hello! I am John Doe.',
    createdAt: new Date(),
    followers: [],
    following: [],
  }
  
];