import mongoose from "mongoose"

const connectDB= async()=>{
    try {
        const connect= await mongoose.connect(process.env.MONGO_URL,{
            //To avoid warnings in the console
            useNewUrlParser:true,
            useUnifiedTopology:true,
          
        });
        console.log(`MongoDB connected :${connect.connection.host}`);
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}
export default connectDB