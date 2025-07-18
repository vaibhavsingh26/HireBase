import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
            console.log("Connected to MongoDB");
            console.log("Connecting to:", process.env.MONGO_URI);
mongoose.connection.on('error', err => console.log("Mongoose error:", err));
mongoose.connection.once('open', () => console.log("Mongoose connected ✅"));

         }
        catch (error) {
            console.log("Error connecting to MongoDB:", error);
        }
    }
export default connectDB;

