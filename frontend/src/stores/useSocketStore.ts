import {create} from "zustand";
import {connect, io, type Socket} from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketState } from "@/type/store";
import { useChatStore } from "./useChatStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if(existingSocket) return; //tránh tạo nhiều socket

        const socket: Socket = io(baseUrl, {
            auth: {token: accessToken},
            transports: ["websocket"]
        });

        set({socket});

        socket.on("connect", () => {
            console.log("Đã kết nối với socket")
        });
        // online users
        socket.on("onlineUsers", (userIds) => {
            set({onlineUsers: userIds })
        })
        //new message
        socket.on("new-message", ({message, conversation, unreadCounts}) => {
            useChatStore.getState().addMessage(message);
            
            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId,
                    displayName: "",
                    avatarUrl: null,
                }
            };
            
            const updatedConversation = {
                ...conversation, lastMessage, unreadCounts
            }
            if(useChatStore.getState().activeConversationId === message.conversationId){
                // danh dau da doc
            }

            useChatStore.getState().updateConversation(updatedConversation);

        })

    },
    disconnectSocket: () => {
        const socket = get().socket;
        if  (socket){
            socket.disconnect();
            set({socket: null});
        }
    },
}));