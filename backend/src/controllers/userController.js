import { upLoadImageFromBuffer } from '../middlewares/uploadMiddleWare.js';
import User from '../models/User.js'
import bcrypt from 'bcrypt';
export const authMe = async (req, res) => {
    try {
        const user = req.user; // lấy từ middleware
        return res.status(200).json({user});
    } catch (error) {
        console.error("Lỗi khi gọi authMe", error)
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}

export const searchUserByUsername = async (req, res) => {
    try {
        const {username} = req.query;
        if (!username || username.trim() === ""){
            return res.status(400).json({message: "Cần cung cấp username trong query"});
        }

        const user = await User.findOne({username}).select("_id displayName username avatarUrl");
        return res.status(200).json({user})
    } catch (error) {
        console.error("Lỗi xảy ra khi searchUserByUsername");
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id;

        if(!file) {
            return res.status(400).json({message: "Không tìm thấy file"});
        }

        const result = await upLoadImageFromBuffer(file.buffer);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            avatarUrl: result.secure_url,
            avatarID: result.public_id,
        },
        {new: true} 
    ).select("avatarUrl");
        if(!updatedUser.avatarUrl) {
            return res.status(400).json({message: "Cập nhật avt thất bại"});
        }
        return res.status(200).json({avatarUrl: updatedUser.avatarUrl});
    } catch (error) {
        console.error("Lỗi khi upload avatar", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Vui lòng cung cấp mật khẩu cũ và mật khẩu mới" });
        }

        // Fetch user from DB explicitly to get hashedPassword (since auth middleware excludes it)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không chính xác" });
        }

        // Hash new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.hashedPassword = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}