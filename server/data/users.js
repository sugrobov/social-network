import bcrypt from 'bcryptjs';

export const users = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@test.com',
    password: bcrypt.hashSync('123456', 12), // хеш пароля 123456
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    bio: 'Test user bio',
    createdAt: new Date('2024-01-01')
  }
];