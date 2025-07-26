import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://smms1917:smms@cluster0.exhejsz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function connectDB() {
    if (mongoose.connection.readyState === 1) return mongoose;
    return mongoose.connect(MONGODB_URI);
}

export default connectDB;
