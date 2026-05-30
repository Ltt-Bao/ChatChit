import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/type/store";
import { useChatStore } from "./useChatStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    if (existingSocket) return; //tránh tạo nhiều socket

    const socket: Socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });
    // online users
    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
    //new message
    socket.on("new-message", ({ message, conversation, unreadCounts }) => {
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: "",
          avatarUrl: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };
      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        useChatStore.getState().markAsSeen();
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });

    //read message
    socket.on("read-message", ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };

      useChatStore.getState().updateConversation(updated);
    });

    // new group chat
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });

    // update conversation
    socket.on("update-conversation", (conversation) => {
      useChatStore.getState().updateConversation(conversation);
    });

    // removed from group
    socket.on("removed-from-group", ({ conversationId }) => {
      const { conversations, activeConversationId } = useChatStore.getState();
      const newConversations = conversations.filter(c => c._id !== conversationId);
      useChatStore.setState({ 
        conversations: newConversations,
        activeConversationId: activeConversationId === conversationId ? null : activeConversationId
      });
    });

    // deleted conversation
    socket.on("deleted-conversation", ({ conversationId }) => {
      const { conversations, activeConversationId } = useChatStore.getState();
      const newConversations = conversations.filter(c => c._id !== conversationId);
      useChatStore.setState({ 
        conversations: newConversations,
        activeConversationId: activeConversationId === conversationId ? null : activeConversationId
      });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
