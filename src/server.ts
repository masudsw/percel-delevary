import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { app } from './app';

dotenv.config(); // Load environment variables from .env


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});