import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import AppError from './utils/AppError.js';

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// if (process.env.NODE_ENV === 'production') {
//   app.use(generalLimiter);
// }

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social Media API', version: '1.0.0' });
});

// app.all('*', (req, res, next) => {
//   console.log('Route not found:', req.method, req.originalUrl);
//   next(new AppError(`Route ${req.originalUrl} not found`, 404));
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;