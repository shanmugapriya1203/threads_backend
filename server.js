import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDb.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import bodyParser from 'body-parser'; 
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import {v2 as cloudinary} from 'cloudinary';
dotenv.config()
connectDB()

const app=express()

const PORT= process.env.PORT || 5000
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
app.use(cors());



app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})