import {create} from 'zustand'
import {toast} from 'sonner'
import { authService } from '@/services/authService'
import type { authState } from '@/type/store'
import { persist } from 'zustand/middleware'
import { useChatStore } from './useChatStore'

export const useAuthStore = create<authState>()(
    persist((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({accessToken});
    },

    clearState: () => {
        set({accessToken: null, user: null,loading: false});
        useChatStore.getState().reset();
        localStorage.clear();
        sessionStorage.clear();
    },

    signUp: async (username, password, email, firstname, lastname) => {
        try {
            set({loading: true})
            // gọi api
            await authService.signUp(username, password, email, firstname, lastname);
            toast.success("Đăng kí thành công")
        } catch (error) {
            console.error(error);
            toast.error("Đăng kí không thành công");
        } finally{
            set({loading: false})
        }
    },

    signIn: async (username, password) => {
        try {
            get().clearState();
            set({loading:true})
            
            localStorage.clear();
            useChatStore.getState().reset();
            //gọi api
            const {accessToken} = await authService.signIn(username, password);
            get().setAccessToken(accessToken);
            await get().fetchMe();
            useChatStore.getState().fetchConversations();

            toast.success("Chào mừng ní quay lại với ChatChit nhaa")
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập không thành công");
        } finally {
            set({loading: false})
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đăng xuất không thành công");
        }
    },

    fetchMe: async () => {
        try {
            set({loading: true});
            const user = await authService.fetchMe();
            set({user})
        } catch (error) {
            console.error(error)
            set({user: null, accessToken: null})
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng")
        } finally {
            set({loading: false})
        }
    },

    refresh: async () => {
        try {
            set({loading: true})
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);
            if(!user){
                await fetchMe();
            }
        } catch (error) {
            console.error(error);
            toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            get().clearState();
        } finally {
            set({loading: false})
        }
    }
}),{
    name: "auth-storage",
    partialize: (state) => ({user: state.user}), //chi persist user
})
)