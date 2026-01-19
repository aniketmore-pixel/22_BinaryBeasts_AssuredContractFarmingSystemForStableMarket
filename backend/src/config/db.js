const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.log("⚠️ Backend is running in 'Offline DB' mode. Please start MongoDB for auth to work.");
    }
};

module.exports = connectDB;
