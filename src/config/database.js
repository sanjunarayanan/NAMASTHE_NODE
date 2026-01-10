import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/namasthe_node')
    console.log(`MongoDB Connected: ${conn.connection.name}`)
  } catch (error) {
    console.error('Database connection failed:', error.message)
    process.exit(1) // stop app if DB fails
  }
}

export default connectDb
