import Conversation from '../models/Conversation.js';
import Friend from '../models/Friend.js';


export const checkFriendShip = async (req, res, next) => {
    try {
        const me = req.user._id.toString();
        const recipientId = req.body?.recipientId ?? null;
        const memberIds = req.body?.memberIds ?? [];
        if (!recipientId && memberIds.length === 0) {
            return res.status(400).json({ message: "Cần cung cấp recipientId hoặc memberIds" });
        }

        if (recipientId) {
            const isFriend = await Friend.findOne({
                $or: [
                    { userA: me, userB: recipientId },
                    { userA: recipientId, userB: me }
                ]
            });

            if (!isFriend) {
                return res.status(403).json({ message: "Bạn chưa kết bạn với người này" });
            }

            return next();
        }

        // kiểm tra isFriend với tất cả memberIds nếu là nhóm
        if (memberIds.length > 0) {
            const friendCheck = memberIds.map(async (memberId) => {
                const friend = await Friend.findOne({
                    $or: [
                        { userA: me, userB: memberId },
                    ]
                });
                return friend ? null : memberId; // Nếu là bạn thì return null, không thì return ID để lọc
            });


            const results = await Promise.all(friendCheck);
            const notFriends = results.filter(Boolean); // Lọc ra những ID không phải là bạn bè

            if (notFriends.length > 0) {

                return res.status(403).json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm" });
            }
        }

        // const results = await Promise.all(frienCheck);
        // const notFriends = results.filter(Boolean);

        // if (notFriends.length > 0){
        //     return res.status(403).json({message: "Bạn chỉ có thể them bạn bè vào nhóm"});
        // }
        return next();
    } catch (error) {
        console.error("Lỗi khi kiểm tra isFriend");
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const checkGroupMember = async (req, res, next) => {
    try {
        const { conversationId } = req.body;
        const userId = req.user._id;
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
        }

        const isMember = conversation.participants.some(
            (p) => p.userId.toString() === userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: "Bạn không phải là thành viên của nhóm này" });
        }
        req.conversation = conversation;
        next();
    } catch (error) {
        console.error("Lỗi khi kiểm tra thành viên nhóm");
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}