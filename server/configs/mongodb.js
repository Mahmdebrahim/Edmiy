import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    mongoose.connection.on("connected",()=>console.log("DB connectes"))
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    }   
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;