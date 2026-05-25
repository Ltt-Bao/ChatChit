import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Tên nhóm và thành viên không thể thiếu" });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });
      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });
        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }

    if (!conversation) {
      return res
        .status(400)
        .json({ message: "Conversation type không hợp lệ" });
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    const participants = conversation.participants.map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formatted = {...conversation.toObject(), participants};

    if(type === "group"){
      memberIds.forEach((userId) => {
        io.to(userId).emit("new-group", formatted);
      })
    }

    return res.status(201).json({ conversation: formatted});
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, URLPattern: -1 })
      .populate({
        path: "participants.userId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "lastMessage.senderId",
        select: "displayName avatarUrl",
      })
      .populate({
        path: "seenBy",
        select: "displayName avatarUrl",
      });

    const formatted = conversations.map((conv) => {
      const participants = conv.participants.map((p) => ({
        _id: p.userId?._id,
        displayName: p.userId?.displayName,
        avatarUrl: p.userId?.avatarUrl ?? null,
        joinedAt: p.joinedAt,
      }));
      return {
        ...conv.toObject(),
        unreadCounts: conv.unreadCounts || {},
        participants,
      };
    });
    return res.status(200).json({ conversations: formatted });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách trò chuyện", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;
    const query = { conversationId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) + 1);

    let nextCursor = null;
    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }
    messages = messages.reverse();
    return res.status(200).json({ messages, nextCursor });
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getUserConversationsForSocketIo = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi fetch conversation", error);
    return [];
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();
    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res
        .status(200)
        .json({ message: "Không có tin nhắn nào để đánh dấu đã xem" });
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({
        message: "Bạn không cần đánh dấu đã xem cho tin nhắn của mình",
      });
    }

    const updated = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      { new: true },
    );

    io.to(conversationId).emit("read-message", {
      conversation: updated,
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        createdAt: updated?.lastMessage.createdAt,
        sender: {
          _id: updated?.lastMessage.senderId._id,
        },
      },
    });

    return res.status(200).json({
      message: "Đã đánh dấu tin nhắn đã đọc",
      seenBy: updated?.seenBy || [],
      myUnreadCount: updated?.unreadCounts[userId] || 0,
    });
  } catch (error) {
    console.error("Lỗi khi đánh dấu tin nhắn đã đọc", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addMembers = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { memberIds } = req.body;
    const userId = req.user._id;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Danh sách thành viên không hợp lệ" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
    }

    if (conversation.type !== "group") {
      return res.status(400).json({ message: "Chỉ có thể thêm thành viên vào nhóm" });
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Bạn không phải là thành viên của nhóm này" });
    }

    const currentMemberIds = conversation.participants.map((p) => p.userId.toString());
    const newMembers = memberIds.filter((id) => !currentMemberIds.includes(id));

    if (newMembers.length === 0) {
      return res.status(400).json({ message: "Tất cả thành viên đã có trong nhóm" });
    }

    const newParticipants = newMembers.map((id) => ({
      userId: id,
      joinedAt: new Date(),
    }));

    conversation.participants.push(...newParticipants);
    await conversation.save();

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    const participants = conversation.participants.map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formatted = { ...conversation.toObject(), participants };

    // Emit event to new members
    newMembers.forEach((id) => {
      io.to(id).emit("new-group", formatted);
    });

    // Emit event to existing members to update conversation
    currentMemberIds.forEach((id) => {
      io.to(id).emit("update-conversation", formatted);
    });

    return res.status(200).json({ conversation: formatted });
  } catch (error) {
    console.error("Lỗi khi thêm thành viên", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { conversationId, memberId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
    }

    if (conversation.type !== "group") {
      return res.status(400).json({ message: "Chỉ có thể xóa thành viên khỏi nhóm" });
    }

    if (conversation.group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Chỉ trưởng nhóm mới có quyền xóa thành viên" });
    }

    if (conversation.group.createdBy.toString() === memberId.toString()) {
      return res.status(400).json({ message: "Không thể xóa trưởng nhóm" });
    }

    const memberIndex = conversation.participants.findIndex(
      (p) => p.userId.toString() === memberId.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Thành viên không có trong nhóm" });
    }

    conversation.participants.splice(memberIndex, 1);
    await conversation.save();

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayName avatarUrl" },
      { path: "lastMessage.senderId", select: "displayName avatarUrl" },
    ]);

    const participants = conversation.participants.map((p) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    const formatted = { ...conversation.toObject(), participants };

    // Emit event to the removed member
    io.to(memberId).emit("removed-from-group", { conversationId });

    // Emit event to existing members to update conversation
    const currentMemberIds = conversation.participants.map((p) => p.userId.toString());
    currentMemberIds.forEach((id) => {
      io.to(id).emit("update-conversation", formatted);
    });

    return res.status(200).json({ conversation: formatted });
  } catch (error) {
    console.error("Lỗi khi xóa thành viên", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Cuộc trò chuyện không tồn tại" });
    }

    if (conversation.type === "group" && conversation.group.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Chỉ trưởng nhóm mới có quyền xóa nhóm" });
    }

    const currentMemberIds = conversation.participants.map((p) => p.userId.toString());

    await Message.deleteMany({ conversationId: conversation._id });
    await Conversation.findByIdAndDelete(conversation._id);

    currentMemberIds.forEach((id) => {
      io.to(id).emit("deleted-conversation", { conversationId });
    });

    return res.status(200).json({ message: "Đã xóa cuộc trò chuyện", conversationId });
  } catch (error) {
    console.error("Lỗi khi xóa cuộc trò chuyện", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
