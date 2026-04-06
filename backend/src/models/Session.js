import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        index: true
    },
    refreshToken: {
        type: String,
        require: true,
        unique: true,
    },
    expireAt: {
        type: Date,
        require: true
    }
}, {
    timestamps: true
});

// auto xóa khi hết hạn

sessionSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

export default mongoose.model('Session', sessionSchema);