import {create} from 'zustand'
import {toast} from 'sonner'
import { authService } from '@/services/authService'
import type { authState } from '@/type/store'

export const useAuthStore = create<authState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({accessToken: null, user: null, loading: false});
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
            set({loading:true})

            //gọi api
            const {accessToken} = await authService.signIn(username, password);
            set({accessToken});

            toast.success("Chào mừng ní quay lại với ChatChit nhaa")
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập không thành công");
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
    }
}))