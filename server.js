import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDb.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
dotenv.config()
connectDB()

const app=express()

const PORT= process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})