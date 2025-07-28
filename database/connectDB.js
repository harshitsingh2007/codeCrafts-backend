import mongoose from 'mongoose'
export const connectDb=async()=>{
 try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongo db connect ${conn.connection.host}`)
 } catch (error) {
    console.log(error.message)
    process.exit(1)
 }
}
