import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, // link hiển thị hình
    },
    avatarID: {
        type: String, // id của hình trong cloudinary
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true, // cho phép trùng lặp giá trị (nếu có) nhưng không bắt buộc
        trim: true
    },
},  {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;