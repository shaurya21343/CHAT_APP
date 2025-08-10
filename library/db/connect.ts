import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectDB() {
    if (mongoose.connection.readyState === 1) return mongoose;
    return mongoose.connect(MONGODB_URI);
}

export default connectDB;
