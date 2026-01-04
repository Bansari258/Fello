import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import cookieParser from 'cookie-parser'
import { AppError } from './utils/AppError.js'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true  // CRITICAL!
}));
app.use(helmet());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://bansarishah258:jI7US1bNtlgcsV8A@fello.fsdgqwo.mongodb.net/fello?appName=fello");

        console.log(`MongoDB Connected`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
connectDB();

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
