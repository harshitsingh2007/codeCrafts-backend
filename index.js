import express from 'express';
import { connectDb } from './database/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 4000; // Added fallback port
const app = express();

// Middlewares
app.use(express.json());

// CORS Configuration (updated for production)
app.use(cors({
  origin: [
    "http://localhost:3000", // Local development
    "https://code-crafts-frontend.vercel.app/"
  ],
  credentials: true,
}));

// Fixed route parameter order
app.get('/', (req, res) => {
    res.send("hello express");
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

// Start server
app.listen(port, () => {
    connectDb()
        .then(() => console.log(`Server running on http://localhost:${port}`))
        .catch(err => console.error("Database connection failed:", err));
});