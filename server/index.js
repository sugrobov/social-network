import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import storyRoutes from './routes/stories.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Временно отключаем helmet
// app.use(helmet());

// Настройка CORS для API
const corsOptions = {
  origin: '*', // разрешаем все источники (для разработки)
  // credentials: true, // убираем, т.к. с origin '*' нельзя использовать credentials
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ========== СТАТИЧЕСКИЕ ФАЙЛЫ С CORS ==========
// Сначала добавляем заголовки и запрещаем кэширование
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
// Затем раздаём статику без кэширования
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  etag: false,
  lastModified: false,
}));

// ========== ОСТАЛЬНЫЕ МИДЛВАРЫ ==========
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json());

// ========== МАРШРУТЫ ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Social Network API is running!', version: '1.0.0' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});