import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; //Bearer <token> đang lấy ra token sau bearer

        if(!token){
            return res.status(401).json({message: "Không tìm thấy access token"});
        }
        // xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err){
                console.error(err)
                return res.status(403).json({message: "Access token hết hạn hoặc sai"})
            }
            // tìm user trong db
            const user = await User.findById(decodedUser.userID).select('-hashedPassword');
            if(!user){
                return res.status(404).json({message: "Người dùng không tồn tại"})
            }
            // trả về user trong req
            req.user = user;
            next();
        })
    } catch (error) {
        console.error("Lỗi khi xác minh trong authMiddleWare", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}