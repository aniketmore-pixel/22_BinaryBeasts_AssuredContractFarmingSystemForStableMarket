require('dotenv').config();
const app = require('./app');
const connectDB = async () => {
    try {
        const connect = require('./config/db');
        await connect();
    } catch (err) {
        console.error(err);
    }
};

// Start Server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
