const jsonServer = require('json-server');
// Для json-server v0.17.4 auth подключается так
const auth = require('json-server-auth');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Простая имитация auth для разработки
server.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Проверяем, существует ли пользователь
  const users = router.db.get('users').value();
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Создаем нового пользователя
  const newUser = {
    id: Date.now(),
    email,
    password, // в реальном проекте нужно хешировать!
    firstName,
    lastName,
  };
  
  router.db.get('users').push(newUser).write();
  
  // Возвращаем пользователя с токеном
  res.json({
    user: { id: newUser.id, email, firstName, lastName },
    token: 'mock-jwt-token-' + Date.now()
  });
});

server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    user: { id: user.id, email, firstName: user.firstName, lastName: user.lastName },
    token: 'mock-jwt-token-' + Date.now()
  });
});

// API для постов
server.get('/api/posts', (req, res) => {
  const posts = router.db.get('posts').value();
  res.json(posts);
});

server.post('/api/posts', (req, res) => {
  const newPost = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: []
  };
  router.db.get('posts').push(newPost).write();
  res.json(newPost);
});

server.post('/api/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const post = router.db.get('posts').find({ id: parseInt(postId) }).value();
  
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  // Имитируем like/unlike
  const updatedPost = { ...post };
  res.json({ post: updatedPost });
});

server.post('/api/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  
  const comment = {
    id: Date.now(),
    content,
    createdAt: new Date().toISOString(),
    author: { id: 1, firstName: 'Test', lastName: 'User' }
  };
  
  res.json({ postId: parseInt(postId), comment });
});

// API для сторис
server.get('/api/stories/feed', (req, res) => {
  const stories = router.db.get('stories').value();
  res.json(stories);
});

server.use('/api', router);

server.listen(5000, () => {
  console.log('🚀 JSON Server is running on port 5000');
  console.log('📚 API endpoints:');
  console.log('   POST   /api/auth/register');
  console.log('   POST   /api/auth/login');
  console.log('   GET    /api/posts');
  console.log('   POST   /api/posts');
  console.log('   POST   /api/posts/:postId/like');
  console.log('   POST   /api/posts/:postId/comments');
  console.log('   GET    /api/stories/feed');
});