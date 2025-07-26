import express from 'express';
import { connectDb } from './database/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const port =process.env.PORT
const app=express()
app.use(express.json())

app.use(cors({
  origin:"http://localhost:3000",
    credentials:true,
}))

app.get('/',(res,req)=>{
    res.send("hello express")
})

app.use('/api/auth',authRoutes)

app.listen(port,()=>{
   connectDb()
    console.log(`http://localhost:${port}`)
})
