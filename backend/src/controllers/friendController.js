import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";



export const sendFriendRequest = async (req, res) => {
    try {
        const {to, message} = req.body;
        const from = req.user._id;

        if(from === to){
            return res.status(500).json({message: "Không thể gửi lời mời kết bạn cho chính mình"});
        }

        const UserExist = await User.exists({_id: to});

        if(!UserExist){
            return res.status(404).json({message: "Người dùng không tồn tại"});
        }

        let userA = from.toString();
        let userB = from.toString();

        if(userA > userB){
            [userA, userB] = [userB, userA]
        }

        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({userA, userB}),
            FriendRequest.findOne({
                $or: [
                    {from, to},
                    {from: to, to: from}
                ]
            })
        ])

        if(alreadyFriend){
            return res.status(400),json({message: "Hai người đã là bạn bè"});
        }

        if(existingRequest){
            return res.status(400).json({message: "Đã có lời mời kết bạn đang chờ"})
        }

        const request = await FriendRequest.create({
            from,
            to,
            message,
        });

        return res.status(200).json({message: "Gửi lời mời kết bạn thành công",request})
    } catch (error) {
        console.error("Lỗi khi gửi lời mời kết bạn", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi chấp nhận lời mời kết bạn", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi từ chối lời mời kết bạn", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const getAllFriend = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const getAllFriendRequest = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lời mời kết bạn", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}