
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app';
dotenv.config(); // Load environment variables from .env

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.DB_URL 
// || 'mongodb+srv://mongodb:mongodb@cluster0.tatfmly.mongodb.net/ParcelDeliveryDB?retryWrites=true&w=majority&appName=Cluster0';
if(!MONGODB_URI){
    throw new Error("db url not found in environment variable")
}
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});