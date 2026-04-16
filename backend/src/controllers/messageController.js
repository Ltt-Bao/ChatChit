import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { upDateConversationAfterMessage } from "../utils/messageHelper.js";


export const sendDirectMessage = async (req, res) => {
    try {
        const {recipientId, content, conversationId} = req.body;
        const senderId = req.user._id;

        let conversation;

        if(!content){
            return res.status(404).json({message: "Thiếu nội dung tin nhắn"});
        }

        if(conversationId){
            conversation = await Conversation.findById(conversationId);
        }

        if(!conversation){
            conversation = await Conversation.create({
                type: "direct",
                participants: [
                    {userId: senderId, joinAt: new Date()},
                    {userId: recipientId, joinAt: new Date()}
                ],
                lastMessage: new Date(),
                unreadCounts: new Map()
            })
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId,
            content,
        });

        upDateConversationAfterMessage(conversation, message, senderId);

        await conversation.save();

        return res.status(201).json({message})
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn trực tiếp", error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const {conversationId, content} = req.body;
        const senderId = req.user._id;
        const conversation = req.conversation;

        if(!content){
            return res.status(404).json({message: "Thiếu nội dung tin nhắn"});
        }

        const message = await Message.create({
            conversationId,
            senderId,
            content,
        });
        upDateConversationAfterMessage(conversation, message, senderId);
        await conversation.save();
        return res.status(201).json({message})
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn nhóm", error);
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}