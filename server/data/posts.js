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

// Получить все посты (с возможностью фильтрации по автору)
export const getAllPosts = () => posts;

// Получить посты определённого пользователя
export const getUserPosts = (userId) => {
  return posts.filter(post => post.author.id === userId);
};

// Добавить новый пост
export const addPost = (post) => {
  posts.unshift(post);
  return post;
};

// Обновить существующий пост (лайки, комментарии)
export const updatePost = (updatedPost) => {
  const index = posts.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = updatedPost;
  }
  return updatedPost;
};

// Удалить пост по id
export const deletePost = (postId) => {
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== postId);
  return posts.length < initialLength;
};

// Найти пост по id
export const findPostById = (postId) => {
  return posts.find(p => p.id === postId);
};