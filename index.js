import express from 'express';
import { connectDb } from './database/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();


app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://code-crafts-frontend.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.get('/', (req, res) => {
    res.send("hello express");
});


app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});


app.listen(port, () => {
    connectDb()
        .then(() => console.log(`Server running on http://localhost:${port}`))
        .catch(err => console.error("Database connection failed:", err));
});

