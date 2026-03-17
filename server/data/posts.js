export const posts = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      avatar: null
    },
    content: 'Это мой первый пост! Привет, мир!',
    image: null,
    likes: ['2', '3'],
    comments: [
      {
        id: '1',
        author: {
          id: '2',
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          avatar: null
        },
        content: 'Отличный пост!',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    author: {
      id: '1',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      avatar: null
    },
    content: 'Ещё один интересный пост!',
    image: null,
    likes: ['1'],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];