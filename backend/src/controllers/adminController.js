import User from "../models/User.js";

// Lấy danh sách tất cả người dùng (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        .select("-hashedPassword")
        .sort({ createdAt: -1 });

        return res.status(200).json({ users });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

// Cập nhật trạng thái người dùng (admin)

export const updateUserStatus = async (req, res) => {
    try {
        const {userId} = req.params;
        const adminId = req.user._id.toString();

        // Không cho phép admin tự khóa tài khoản của mình
        if(userId === adminId){
            return res.status(400).json({
                message: "Bạn không thể thay đổi trạng thái của mình"
            })
        }

        // Kiểm tra user tồn tại hay ko
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "Người dùng không tồn tại"
            })
        }

        // Cập nhật trạng thái người dùng
        user.isActive = !user.isActive;
        await user.save();
        const statusMessage = user.isActive ? "được mở khóa" : "bị khóa";
        return res.status(200).json({
            message: `User ${user.username} đã ${statusMessage}`
        })
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái người dùng", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

