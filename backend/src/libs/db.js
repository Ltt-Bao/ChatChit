import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";



const initAdmin = async () => {
    try {
        
        // kiểm tra xem đã có superadmin chưa
        const superAdmin = await User.findOne({username: "admin"});
        if(!superAdmin){
            const hashedPassword = await bcrypt.hash("super123", 10);

            await User.create({
                username: "admin",
                hashedPassword: hashedPassword,
                email: "admin@hihi.hihi",
                displayName: "Admin",
                role: "admin",
                isActive: true,
                isVerified: true
            });
            console.log("Tạo admin thành công");
        }
        else {
            console.log("Admin đã tồn tại, không cần tạo mới")
        }
    } catch (error) {
        console.error("Error creating admin account:", error);
    }
}


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        await initAdmin();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}