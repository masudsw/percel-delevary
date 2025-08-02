"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
dotenv_1.default.config(); // Load environment variables from .env
console.log(dotenv_1.default.config());
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.DB_URL;
// || 'mongodb+srv://mongodb:mongodb@cluster0.tatfmly.mongodb.net/ParcelDeliveryDB?retryWrites=true&w=majority&appName=Cluster0';
if (!MONGODB_URI) {
    throw new Error("db url not found in environment variable");
}
// Connect to MongoDB
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// Start the server
app_1.app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
