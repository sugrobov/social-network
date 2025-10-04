import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import storyRoutes from './routes/stories.js';
import uploadRoutes from './routes/upload.js';

console.log('=== BEFORE dotenv.config() ===');
console.log('Current directory:', process.cwd());
console.log('Files in current directory:');
import fs from 'fs';
try {
  const files = fs.readdirSync(process.cwd());
  console.log(files.filter(f => f.includes('.env')));
} catch (error) {
  console.log('Error reading directory:', error.message);
}

// Загружаем .env
dotenv.config();

// Детальная диагностика ПОСЛЕ dotenv.config()
console.log('=== AFTER dotenv.config() ===');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
console.log('All env variables starting with DB_:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('DB_') || key.startsWith('JWT_') || key === 'PORT' || key === 'NODE_ENV') {
    console.log(`  ${key}: ${process.env[key]}`);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url); // Get the full path to the file
const __dirname = path.dirname(__filename); // Get the directory name


app.use(helmet());  // Add helmet middleware to secure your API

const limiter = rateLimit({ // rate limiting middleware
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(cors());


app.use((req, res, next) => {
  console.log('=== RAW REQUEST ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    console.log('Raw body:', data);
    console.log('Body length:', data.length);
  });
  
  next();
});

app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Social Network API is working!',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {  // error handler
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});