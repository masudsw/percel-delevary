
import { Server } from 'http';
import mongoose from 'mongoose';
import { envVars } from './app/config/env';
import { app } from './app';
import { connectRedis } from './app/config/redis.config';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
/* eslint-disable @typescript-eslint/no-unused-vars */
let server: Server;
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("connected to db!!");
        server = app.listen(envVars.PORT, () => {
            console.log(`Server listing to port ${envVars.PORT}`)
        });
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    try {
        await connectRedis()
        await startServer()
        await seedSuperAdmin()

    } catch (error) {
        console.log(error)
         process.exit(1);
    }

})()

// dotenv.config(); // Load environment variables from .env

// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.DB_URL
// // || 'mongodb+srv://mongodb:mongodb@cluster0.tatfmly.mongodb.net/ParcelDeliveryDB?retryWrites=true&w=majority&appName=Cluster0';
// if(!MONGODB_URI){
//     throw new Error("db url not found in environment variable")
// }
// // Connect to MongoDB
// mongoose.connect(MONGODB_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });